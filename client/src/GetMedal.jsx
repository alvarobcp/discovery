import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';

function GetMedal() {

    const {id} = useParams(); //useParams para traer el id que le mando en el endpoint
    const navigate = useNavigate(); //para redirigir a la página principal

    const { loginWithRedirect, getIdTokenClaims, isAuthenticated, isLoading } = useAuth0(); //sacamos los datos del usuario

    useEffect(() => {
    const claimMedal = async () => {
      if (isLoading) return;

      if(!isAuthenticated){

         await loginWithRedirect({
          appState: { returnTo: `/medal/${id}` }, //logingWithRedirect nos hará loguearnos, o crear usuario, y de ahi nos redirige a la medalla
        });
        return;

      }

      try {
        const token = await getIdTokenClaims();
        const response = await fetch(`http://localhost:3000/medal/${id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.__raw}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Yesssss");
          if(result.status === "already_achieved"){
            console.log("you already had the medal");

          } else if(result.status === "updated_achieved"){
            console.log("you got the medal");
          }
          else{
            console.log("noo something happened");
          }

        } else {
          console.log("noo something happened no medal");
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        navigate("/"); //redirigimos, de momento, luego implementaremos algo para que el usuario consiga la medalla de una forma visual
      }
    };

    claimMedal();
  }, [id, isAuthenticated, isLoading]);


    return <p>Medallica conseguida aquí pondremos cositas de momento esto</p>



}

export default GetMedal