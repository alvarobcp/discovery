import { use, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';

function GetMedal() {

    const {id} = useParams(); //useParams para traer el serial que le mando en el endpoint
    const navigate = useNavigate(); //para redirigir a la página principal
    const [medalLoaded, setMedalLoaded] = useState(false);
    const [medalData, setMedalData] = useState(null);
    const [hadMedal, setHadMedal] = useState(false);

    const { loginWithRedirect, getIdTokenClaims, isAuthenticated, isLoading } = useAuth0(); //sacamos los datos del usuario

    useEffect(() => {

    const claimMedal = async () => {
      if (isLoading) return;

      if(!isAuthenticated){

        await loginWithRedirect({
          appState: { returnTo: `/` }, //logingWithRedirect nos hará loguearnos, o crear usuario, y de ahi nos redirige a la medalla
        });
        return;

      }

      try {
        const token = await getIdTokenClaims();
        const response = await fetch(`https://discovery-slax.onrender.com/api/medal/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.__raw}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok) {
       
          if(result.status === "already_achieved"){
            setHadMedal(true);

          } else if(result.status === "updated_achieved"){
            setHadMedal(false);
          }
          else{
            navigate('/');
          }

        } else {
          navigate('/');
        }
      } catch (err) {
        console.error("Error:", err);
        navigate('/');
      } finally {
        setMedalLoaded(true);
      }
    };

    claimMedal();
  }, [id, isAuthenticated, isLoading]);



  useEffect(() => {
    
    if (!medalLoaded || !id) return;

    const getMedalData = async () => {

      try{

        const response = await fetch(`https://discovery-slax.onrender.com/api/medal/data/${id}`);

        if(!response.ok) {
          const error = await response.text();
          console.error('Fetch error;', error)
          return;
        }

        const data = await response.json();
        setMedalData(data);

      } catch (err) {
        console.error('Error:', err.message);
      }
    };

    getMedalData();

  }, [isAuthenticated, medalLoaded]);



/*[] Futura actualización: Añadir pantalla de carga*/
    return(
    isLoading ? (<p>Cargando...</p>) :
    (<div className='get-medal-container'>
    <p className='medal-p'>{hadMedal ? '¡Ya tienes esta medalla, busca las demás!' : '¡Enhorabuena, has conseguido la medalla!'}</p>
    <img width="100" height="100" src="https://img.icons8.com/keek/100/festival.png" alt="festival"/>
    {medalData === null ? <p>Cargando la medalla... 🏅</p> : 
    <div className='title-section' style={{marginBottom: '15px'}}>
      <h2 style={{color:`${medalData.color}`, textShadow: 'none'}}>{medalData.title}</h2>
      <div className='medal title-medal' style={{border:`${medalData.color} 4px solid`}}><img className='medal-text' src={medalData.icon_url}></img></div>
    </div>
    }
    <button className='button-style' onClick={() => navigate(`/medal/achieved/${medalData.serial}`)}>¡Ver medalla!</button>
    </div>)
    )


}


export default GetMedal