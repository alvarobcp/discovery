import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from "@auth0/auth0-react";
import AchievedMedal from './AchievedMedal.jsx';

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
    cacheLocation="localstorage"
  >
    <Router>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/medal/:id" element={<GetMedal/>} />
        <Route path="/medal/achieved/:id" element={<AchievedMedal/>} />
      </Routes>
    </Router>

  </Auth0Provider>,
)

//React Route para crear más páginas
