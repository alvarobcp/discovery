import React from 'react'
import './App.css'


function Modal({closePopUp, medalData}) {



    return(
    <div className='modal-overlay' onClick={closePopUp}>
    <div className='modal-container' onClick={(e) => e.stopPropagation()}> 
    <p>Esto es mi modal y {medalData.number}</p>
    <button onClick={closePopUp}>close</button>
    </div>
    </div>
    )


}


export default Modal

/*onClick={(e) => e.stopPropagation() para que al hacer click dentro del modal no lo cierre porque lo hemos puesto en el fondo*/