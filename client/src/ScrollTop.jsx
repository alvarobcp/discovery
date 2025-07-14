/*Averiguar si esto está bien y es correcto, es para que me recarge la pagina con el scroll arriba*/

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollTop() {
  
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;

}

export default ScrollTop