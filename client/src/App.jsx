import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';

function App() {
//Vamos a escribir paso a paso como lo he hecho para la próxima
  
const { loginWithRedirect, getIdTokenClaims, logout, isAuthenticated, user, isLoading, } = useAuth0();

  const urls = ['https://i.postimg.cc/RqLjw0VN/ahy631d98.jpg', 'https://i.postimg.cc/qzmSZZKr/ctp05va31.jpg', 'https://i.postimg.cc/k2BzrFNb/keo05bc21.png'] //temporal para pruebas luego bdd

  const [userLogged, setUserLogged] = useState("");
  const [medals, setMedals] = useState([]);

  useEffect(() => { 
    console.log({ isAuthenticated, isLoading, user });
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
  console.log(medals);
  console.log("Lenght: " + medals.length + ", en el primero vamos a buscar las cosas. Tenemos el user id: " + medals[0].medals.title);
  }
}, [isAuthenticated, medals]);

//y ahora ya, con el usuario identificado, podemos acceder a sus datos

if (isLoading) return <p>Loading...</p>;

if (!isAuthenticated) {
    return (
      <button onClick={() => loginWithRedirect()}>Log In</button>  //loginWithRedirect es una función que me da Auth0, se redirige ahí para el login
      //se usar si no se ha iniciado sesión, es la web del inicio con el log in
    );
  } //cuando se autentifica, isAtuhentificated pasa a true, isLoading también, es como que ahí acaba de cargar



  return (
    <>
      <div className="card">
        
        <img className="profile-image" src={user.picture} alt="Profile image" />
        <p className="read-the-docs">{user.nickname}</p>
        <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
        
      </div>
      <h1>Discover Bicorp</h1>

      {medals.length > 0 ? (

        <div className='medals'>
          
          
          {medals.map((element, index) => (

          <div 
          className= {element.achieved ? 'medal' : 'no-medal'}
          key= {index} >

          <div 
              className = {element.achieved ? 'medal-data medal-achieved' : 'medal-data medal-no-achieved'}
              style = {element.achieved ? {backgroundImage: `url(${urls[index]})`} : {backgroundImage: 'none'}}>
              
              {element.achieved ? <></> : <p><span className="material-symbols-outlined">question_mark</span></p>}

          </div>

          { element.achieved ? <p className='medal-text'>Título</p> : <></> }

        </div>

        ))}

        </div>) : 
      
      (<p>Cargando medallicas...</p>) }

   </>    
    
  )
}

export default App




/*<div className='medal' style={ element.achieved ? {backgroundColor:'#FFBB00'} : {backgroundColor:'#f9f4ee'}}>
          <p>{element.medals.title}</p>
          <p>{element.medals.serial}</p>
          dento del div de metal-data meter los elementos e60044

          backgroundImage: `url(${urls[index]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            
          <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg">
          <path
          d={getPathD(15)}
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          fillRule="evenodd"
          /></svg>
          
          const cornerRadius = 15; // ← Cambia este valor para modificar las curvas internas

 const getPathD = (r) => `
  M${r},${r * 2}
  A${r},${r} 0 0 0 ${r * 2},${r}
  L${160 - r * 2},${r}
  A${r},${r} 0 0 0 ${160 - r},${r * 2}
  L${160 - r},${200 - r * 2}
  A${r},${r} 0 0 0 ${160 - r * 2},${200 - r}
  L${r * 2},${200 - r}
  A${r},${r} 0 0 0 ${r},${200 - r * 2}
  Z
`;
          */