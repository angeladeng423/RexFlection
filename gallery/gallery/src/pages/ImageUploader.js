import React from "react";
import { useNavigate } from 'react-router-dom';
import forest from "../assets/forest.png";
import Navbar from "../components/Navbar";
import "./ImageUploader.css";

import { gapi } from 'gapi-script';
import { useEffect } from "react";
import { GoogleLogin } from 'react-google-login';

export default function ImageUploader() {
    const navigate = useNavigate();
    function navTo(){
        navigate('/gallery')
    }

    const clientId = "1044768649244-j1qtke8g728no98ug6qrsu276qt6tmld.apps.googleusercontent.com"

    useEffect(() => {
        function start(){
            gapi.client.init({
                clientId: clientId,
                scope: "https://www.googleapis.com/auth/photoslibrary.readonly"
            })
        }

        gapi.load('client:auth2', start)
    }, [])

    function onSuccess(res){
        console.log("LOGIN SUCCESS.", res.profileObj)

        const accessToken = res.accessToken;
        console.log("Access Token:", accessToken);

        sendToken(accessToken)
        navTo()

        gapi.client.setToken({access_token: accessToken});
    }

    async function retrieveImages(token){
        const response = await fetch(`http://localhost:5000/api/getAlbumItems`, {
            method: 'GET',
            header: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token })
        })

        const data = await response.json();
        console.log(data)

    }

    async function sendToken(token) {
        try {
            const response = await fetch(`http://localhost:5000/api/getAlbumID`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token })
              });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log(data)

        } catch (error) {
          console.log('error', error);
        }
      }

    function onFailure(res){
        console.log("FAILURE.", res)
    }

    return (
        <div className="image-uploader">
            <Navbar></Navbar>
            <div id = "login">
                <GoogleLogin
                    clientId = {clientId}
                    buttonText="Create Your Rewind!"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}/>

                </div>
            <img id = "forest" src = {forest}></img>
            <section>
                <div className="wave wave1"/>
                <div className="wave wave2"/>
                <div className="wave wave3"/>
                <div className="wave wave4"/>
            </section>
        </div>
    );
}
