import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import WelcomeScreen from './WelcomeScreen';

function App() {
//Vamos a escribir paso a paso como lo he hecho para la próxima
  
const { loginWithRedirect, getIdTokenClaims, logout, isAuthenticated, user, isLoading, } = useAuth0();

const navigate = useNavigate();

  const urls = ['https://i.postimg.cc/RqLjw0VN/ahy631d98.jpg', 'https://i.postimg.cc/qzmSZZKr/ctp05va31.jpg', 'https://i.postimg.cc/k2BzrFNb/keo05bc21.png'] //temporal para pruebas luego bdd

  const [userLogged, setUserLogged] = useState("");
  const [medals, setMedals] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentMedal, setCurrentMedal] = useState({
    number:'',
    title: '',
    mision: '',
    icon: ''
  })

  useEffect(() => { 
    //esto creará el usuario en la base de datos, si ya existe, simplemente no hará nada
  const initUser = async () => {
    if (!isAuthenticated || isLoading) return;

    const idToken = await getIdTokenClaims();
      // lo he intentado hacer con getAccessTokenSilently pero al ser una version gratuita no he podido

    await fetch("https://discovery-slax.onrender.com/api/user/init", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken.__raw}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });
  };

  initUser();
}, [isAuthenticated, isLoading]);


useEffect(() => {
  
  if (!isAuthenticated) return;

  const initUserMedals = async () => {
    
    const idToken = await getIdTokenClaims();

    const res = await fetch("https://discovery-slax.onrender.com/api/medals", {
      method: "GET", //usar get???
      headers: {
        Authorization: `Bearer ${idToken.__raw}`,
        "Content-Type": "application/json"
      },
    });
    const medals_data = await res.json(); //necesitamos el await si no manda la promise
    setMedals(medals_data);
  }
  initUserMedals();
  

}, [isAuthenticated, getIdTokenClaims]);

useEffect(() => { //para ver las medallas, en el otro no va a ir porque es asincrono :/ no nos gusta
  if (!isAuthenticated) return;
  if(medals.length > 0){
  }
}, [isAuthenticated, medals]);


const openPopUp = (medal) => {
  setShowPopUp(true);
  const newMedal = {number: medal.mision_number, title: medal.title, mision: medal.mision, icon: medal.icon};
  setCurrentMedal(newMedal)
}
const closePopUp = () => {setShowPopUp(false)};

const editMedal = (number, title, mision, icon) => {setCurrentMedal({number, title, mision, icon})};

//y ahora ya, con el usuario identificado, podemos acceder a sus datos

if (isLoading) return <p>¡Cargando tus datos! 😄</p>;

if (!isAuthenticated) {
    return ( <WelcomeScreen button={<button className='button-style welcome-button-style' onClick={() => loginWithRedirect()}>Iniciar Sesión ✨</button>}>
    </WelcomeScreen>);
  } 

 if(medals.length <= 0){ /*[] Añadir componente de carga*/
         return (
          <div>
            <div>Cargando tus medallas... 🏅</div>
            <button className='button-style' onClick={() => logout({ returnTo: window.location.origin })}>Cerrar Sesión 👋</button>
          </div>
         
        )   
    }


  return (

  
    <div className='app-container'>

      {medals.length > 0 &&
      <div className="card">
      <p className="user-text">Hola de nuevo, <br></br><b>{user.nickname}</b> <br /> <span style={{fontSize:'1.2rem'}}>👋✨</span></p>
      <h1>Aventura en Bicorp</h1>
      </div>}
     


      {showPopUp && 
      <Modal closePopUp={closePopUp} medalData={currentMedal}></Modal> 
      }

      
    
      {medals.length > 0 ? (

        <div className='medals'>
          
          
          {medals.map((element, index) => (

          <button onClick={ element.achieved ? () => navigate(`/medal/achieved/${element.medals.serial}`)  : () => openPopUp(element.medals) }
          
          className= {element.achieved ? 'cell medal' : 'cell no-medal'} 
          style= {element.achieved ? {border:`${element.medals.color} 4px solid`} : {border: '#2b2b2b3f 2px dashed'}}
          key= {index} >
       
          

          { element.achieved ? <img className='medal-text' src={element.medals.icon_url}></img> : <p className='medal-text'>{element.medals.mision_number}</p> }

        </button>

        ))}

        </div>) : 
      
      (<div><p>Cargando tus medallas... 🏅</p><button className='button-style' onClick={() => logout({ returnTo: window.location.origin })}>Cerrar Sesión 👋</button>
      </div>) }
      
      {medals.length > 0 &&
      <button className='button-style end-button' onClick={() => logout({ returnTo: window.location.origin })}>Cerrar Sesión 👋</button>}
      <footer style={{ textAlign: 'center' }}><p className='footer-text'>Desarrollado por Álvaro Delgado para practicar React, CSS, Firebase, Auth0, Supabase y Node.js con Express.</p></footer>
      

   </div>    
    
  )
}

export default App