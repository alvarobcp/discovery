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
  origin: ['http://localhost:3000', 'https://discovery-6f3c1.web.app'],
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
    console.log("Decoded token:", decoded);


   
    // ...


     try {
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('auth0_id', sub)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Supabase error:', fetchError);
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
          console.error('Insert error:', insertError);
          return res.status(500).json({ error: 'Error inserting user' });
        }
      }

      return res.json({ status: 'ok' });
    } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({ error: 'Unexpected server error' });
    }



  });
});

app.get('/', async (req, res) => {
  try {
    const result = await supabase.from('users').select('*');
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//usamos los comandos de supabase (de momento)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));