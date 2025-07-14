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
         return (<div>Cargando los datos...</div>)   
    }


    return(
    
    <div className='medal-container'>
        <div className='title-section'>
            <h2 style={{color:`${medalData.color}`, textShadow: 'none'}}>{medalData.title}</h2>
            <div className='medal title-medal' style={{border:`${medalData.color} 4px solid`}}><img className='medal-text' src={medalData.icon_url}></img></div>
            <p className='title-number' style={{color:`${medalData.color}`}}>Número de misión {medalData.mision_number}</p>
            
        </div>

        <div className='where-section'>
            <img width="90" height="90" src="https://img.icons8.com/keek/100/map-marker.png" alt="map-marker"/>
            <h5 className='section-title'>¿Dónde nos encontramos?</h5>
            <p className='medal-p'>{medalData.place}</p>
        </div>
        
        <div className='description-section'>
            <img width="90" height="90" src="https://img.icons8.com/keek/100/note.png" alt="note"/>
            <h5 className='section-title'>{medalData.section1_title}</h5>
            <p className='medal-p'>{medalData.section1_text}</p>
        </div>

        <div className='quote-section'>
          <img width="90" height="90" src="https://img.icons8.com/keek/100/quote-left.png" alt="quote-left"/>
            <h5 className='section-title'>Frase Bicorina</h5>
            <p className='medal-p'>{medalData.quote}</p>
        </div>

        <div className='image-section'>
          <img width="90" height="90" src="https://img.icons8.com/keek/100/image-gallery.png" alt="image-gallery"/>
            <h5 className='section-title'>Una imágen para el recuerdo</h5>
            <p className='medal-p'>{medalData.url_image_description}</p>
            
        </div>

        <div className='dictionary-section'>
          <img width="100" height="100" src="https://img.icons8.com/keek/100/literature.png" alt="literature"/>
            <h5 className='section-title'>Palabra Bicorina <br /> </h5>
            <p className='medal-p'>{medalData.word}</p>
        </div>

        <button className='button-style' onClick={() => navigate("/")}>Volver a mis medallas 🏅</button>
     
    </div>
 
    )


}


export default AchievedMedal



/*
      COSAS QUE HACER
    [] Si el id no está (404) en la BDD redirigir a pagina de error o a "/"

*/