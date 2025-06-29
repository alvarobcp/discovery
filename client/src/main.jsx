import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from "@auth0/auth0-react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import GetMedal from './GetMedal.jsx';


const domain = "dev-8chgryx2knyxtr23.us.auth0.com";
const clientId = "l5bSjgA9Z1uWT29W5X6BjhzB1kB4mclV";

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    onRedirectCallback={(appState) => {
    navigate(appState?.returnTo || window.location.pathname); //para volver a medal/id despues de iniciar sesion al leer el qr
  }}
  >
    <Router>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/medal/:id" element={<GetMedal/>} />
      </Routes>
    </Router>

  </Auth0Provider>,
)
