import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pool from './db.js';
import { expressjwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import jwt from 'jsonwebtoken';

import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
//app.use(cors());

app.use(cors({
  origin: ['http://localhost:3000', 'https://discovery-6f3c1.web.app', 'https://discovery-slax.onrender.com'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}));



const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const jwksClient = jwksRsa({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

function getKey(header, callback) {
  jwksClient.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

app.use(express.json());

/*const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});*/

app.post('/api/user/init', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, getKey, {
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
  }, async (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { sub, email, nickname, picture } = decoded;



   
    //usamos el data para crear el user en la bdd


     try {
      const { data: user, error: fetchError } = await supabase //si ya existe no hacemos nada
        .from('users')
        .select('*')
        .eq('auth0_id', sub)
        .single(); //el single es para sacar el objeto directamente
        //sacar de aqui el id para no tener que volver a llamar a la bdd? []por hacer

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error:', fetchError);
        return res.status(500).json({ error: 'Error checking user' });
      }

      if (!user) {
        const { error: insertError } = await supabase.from('users').insert([
          {
            auth0_id: sub,
            email: email,
            username: nickname,
            profile_image: picture
          }
        ]);

        if (insertError) {
          console.error('Error:', insertError);
          return res.status(500).json({ error: 'Error inserting user' });
        }
        else{
          //que hacer?
          //[]sacar el id del usuario que acabo de crear
          const {data: id_user, findingIdError} = await supabase
            .from('users')
            .select('id')
            .eq('auth0_id', sub)
            .single() //el single es para sacar el objeto directamente
          if (findingIdError) {
          console.error('Error:', findingIdError);
          return res.status(500).json({ error: 'Error looking for the user by user ID' });
          }
          //[]añadir filas con el id del usuario y las medallas

          const {data: medals, medalsError} = await supabase
            .from('medals')
            .select('id')
          if (medalsError) {
          console.error('Error:', medalsError);
          return res.status(500).json({ error: 'Error getting medals ID' });
          }

          const medals_by_user = medals.map(medal => ({
            user_id: id_user.id,
            medal_id: medal.id,
            achieved: false

          }));

          const {error: insertMedalsError } = await supabase
            .from('user_medals')
            .insert(medals_by_user);
          if (insertMedalsError) {
          console.error('Error:', insertMedalsError);
          return res.status(500).json({ error: 'Error inserting data in user medals table' });
          }


        }
      }


      return res.json({ status: 'ok' });


    } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ error: 'Unexpected server error' });
    }

  });
});

app.post('/medal/:serial', async (req, res) => {

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, getKey, {
    audience: process.env.AUTH0_CLIENT_ID,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
  }, async (err, decoded) => {

    if (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid token' });
    }

      const auth0_id = decoded.sub; //necesitamos el sub para que solo se modifiquen las del usuario que está leyendo el qr

      const { data: user, error: userError } = await supabase //sacamos el user id usando el auth0_id
        .from('users')
        .select('*')
        .eq('auth0_id', auth0_id)
        .single();
      
        if (userError) {
              console.error('Error:', userError);
              return res.status(500).json({ error: `Error looking for the user` });
        }
        
        const medal_serial = req.params.serial; //el serial de la medalla se determina en el endpoint

        const { data: medal, error: serialError } = await supabase //sacamos el id de la medalla por el serial
        .from('medals')
        .select('id')
        .eq('serial', medal_serial)
        .single();
      
        if (userError) {
              console.error('Error:', userError);
              return res.status(500).json({ error: `Error looking for the user` });
        }



      const user_id = user.id; //hemos sacado el id del usuario usando el Auth0_id
      const medal_id = medal.id; //id de la medalla
      

      const { data:isAchieved, errorBool} = await supabase
        .from('user_medals')
        .select('achieved')
        .eq('medal_id', medal_id)
        .eq('user_id', user_id)
        .single()
      if(errorBool) {
              console.error('Error:', errorBool);
              return res.status(500).json({ error: `Error getting achieved boolean` });
        }

      if(isAchieved.achieved){ 

         return res.status(200).json({ status: 'already_achieved' });

      }


      try {
        const { data, error: addMedalError} = await supabase
          .from('user_medals')
          .update({'achieved': true})
          .select('*')
          .eq('medal_id', medal_id)
          .eq('user_id', user_id)

        if (addMedalError) {
              console.error('Error:', addMedalError);
              return res.status(500).json({ error: `Error adding medal number ${medal_id}` });
        }

         return res.status(200).json({ status: 'updated_achieved' });

      } catch (err) {
        res.status(500).json({ error: err.message });
      }
      
      

})
});





app.get('/', async (req, res) => {
  try {
    const result = await supabase.from('users').select('*');
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//usamos los comandos de supabase (de momento así aprendo)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));