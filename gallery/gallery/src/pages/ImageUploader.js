import React from "react";
import Gallery from "../components/GalleryBg";
import "./ImageUploader.css";

import { gapi } from 'gapi-script';
import { useEffect } from "react";
import { GoogleLogin } from 'react-google-login';

export default function ImageUploader() {
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

        gapi.client.setToken({access_token: accessToken});
    }

    async function sendToken(token) {
        try {
          const response = await fetch(
            `https://localhost:5000/sendToken`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } catch (error) {
          console.log('error', error);
        }
      }

    function onFailure(res){
        console.log("FAILURE.", res)
    }

    return (
        <div className="image-uploader">
            <GoogleLogin
                clientId = {clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}/>
            <Gallery/>
        </div>
    );
}
