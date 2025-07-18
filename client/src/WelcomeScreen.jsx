
function WelcomeScreen({button}) {
  

    return ( 
      <div className='welcome-screen'>
        <h1>Aventura en Bicorp</h1>
        <img width="80" height="80" src="https://img.icons8.com/keek/100/lol.png" alt="lol"/>
        <p><b>¡Hola, hola!</b> Estás a punto de empezar la aventura para descubrir todos los datos y curiosidades de <b>Bicorp</b>. <br/> ¡Inicia sesión para comenzar con la aventura!</p>
        {button}
        <p>Ante cualquier duda sobre como jugar, pregunta en el Ecomuseo de Bicorp</p>
        <img width="50" height="50" src="https://img.icons8.com/keek/100/metal-music.png" alt="metal-music"/>
        <footer style={{ textAlign: 'center', color: '#fff' }}><p className='footer-text'>Desarrollado por Álvaro Delgado para practicar React, CSS, Firebase, Auth0, Supabase y Node.js con Express.</p></footer>
        </div>
       
    );

}

export default WelcomeScreen