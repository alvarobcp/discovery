import React from 'react'
import './App.css'


function Modal({closePopUp, medalData}) {



    return(
    <div className='modal-overlay' onClick={closePopUp}>
    <div className='modal-container' onClick={(e) => e.stopPropagation()}> 
    <h3 className='modal-title'>{medalData.title}</h3>
    <span class="material-symbols-outlined">qr_code</span>
    <p className='modal-question'>¿Quiéres saber que debes hacer para encontrarme?</p>
    <p className='modal-mission'>{medalData.mision}</p>
    <p className='modal-end'>¡Mucha suerte en la búsqueda! <br /> 😊🔍 </p>
    <button className='modal-button' onClick={closePopUp}><span class="material-symbols-outlined">close</span></button>
    </div>
    </div>
    )


}


export default Modal

/*onClick={(e) => e.stopPropagation() para que al hacer click dentro del modal no lo cierre porque lo hemos puesto en el fondo*/