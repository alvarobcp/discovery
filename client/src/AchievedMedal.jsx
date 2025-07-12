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
    
    <div className='medal-container'>
        <div className='title-section' style={{backgroundImage: 'url(https://i.ibb.co/WZ7ZKwB/fiestas-rollos-1024x576.jpg)'}}>
            <h2>{medalData.title}</h2>
            <div className='medal title-medal'><img className='medal-text' src={medalData.icon_url}></img></div>
            <p className='title-number'>Número de misión {medalData.mision_number}</p>
            
        </div>
        
        <div className='description-section'>
            <p className='section-title'>{medalData.section1_title}</p>
            <p>{medalData.section1_text}</p>
        </div>

        <div className='quote-section'>
            <p className='section-title'>Frase Bicorina <br />  </p>
            <q>{medalData.quote}</q>
        </div>

        <div className='image-section'>
            <p className='section-title'>Un vistazo al pasado <br /> </p>
            <p>{medalData.url_image_description}</p>
            
        </div>

        <div className='dictionary-section'>
            <p className='section-title'>Palabra Bicorina <br /> </p>
        </div>

        <button className='medal-button' onClick={() => navigate("/")}>Go back!</button>
     
    </div>
 
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


<img src={medalData.url_image} alt={medalData.url_image_description} />

      COSAS QUE HACER
    [] Si el id no está (404) en la BDD redirigir a pagina de error o a "/"

*/