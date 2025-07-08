import React from 'react'
import './App.css'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';


function AchievedMedal() {

    const {id} = useParams();
    const navigate = useNavigate();
    const [medalData, setMedalData] = useState(null);

    const { loginWithRedirect, getIdTokenClaims, isAuthenticated, isLoading } = useAuth0(); //sacamos los datos del usuario




    useEffect(() => {
    
    

    const getMedalData = async () => {

    if (isLoading || !id) return;

      try{

        const response = await fetch(`https://discovery-slax.onrender.com/api/medal/data/${id}`);

        if(!response.ok) {
          const error = await response.text();
          console.error('Fetch error;', error)
          return;
        }

        const data = await response.json();
        setMedalData(data);
        console.log(data);
        console.log(medalData);
      } catch (err) {
        console.error('Error:', err.message);
      }
    };

    getMedalData();

  }, [isAuthenticated]); //hay que añadir isLoading y id??



    if(medalData === null){
         return (<div>cargando...</div>)   
    }


    return(
    <>
    <div className='title-section'>
        <h2>{medalData.title}</h2>
        <h2><span>{medalData.icon}</span></h2>
        <h5>{medalData.mision_number}</h5> 
    </div>
    
    <div className='description-section'>
        <h3>{medalData.section1_title}</h3>
        <p>{medalData.section1_text}</p>
    </div>

    <div className='quote-section'>
        <h3>Frase Bicorina</h3>
        <q>{medalData.quote}</q>
    </div>

    <div className='image-section'>
        <h3>Un vistazo al pasado</h3>
        <p>{medalData.url_image_description}</p>
        <img src={medalData.url_image} alt={medalData.url_image_description} />
    </div>

    <div className='dictionary-section'>
    
    </div>

    <button onClick={() => navigate("/")}>Go back!</button>
       
    </>
    )


}


export default AchievedMedal



/*
 if(!isAuthenticated){

         await loginWithRedirect({
          appState: { returnTo: `https://discovery-slax.onrender.com/api/medal/data/${id}` }, //logingWithRedirect nos hará loguearnos, o crear usuario, y de ahi nos redirige a la medalla
        });
        return;

      }




      COSAS QUE HACER
    [] Si el id no está (404) en la BDD redirigir a pagina de error o a "/"

*/