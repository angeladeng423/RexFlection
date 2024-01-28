import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import forest from "../assets/forest.png";
import Navbar from "../components/Navbar";
import "./ImageUploader.css";

import DescriptionContext from "../context/DescriptionContext";
import ImageContext from "../context/ImageContext";

import { gapi } from 'gapi-script';
import { useEffect } from "react";
import { GoogleLogin } from 'react-google-login';

export default function ImageUploader() {
    const {uriList, addUri, removeUri} = useContext(ImageContext)
    const {descList, addDesc, removeDesc} = useContext(DescriptionContext)

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

    function onSuccess(res) {
        console.log("LOGIN SUCCESS.", res.profileObj);
    
        const accessToken = res.accessToken;
        console.log("Access Token:", accessToken);
    
        // Set the token for gapi client
        gapi.client.setToken({ access_token: accessToken });
    
        sendToken(accessToken).catch(error => {
            console.error('Error during sendToken or retrieveImages', error);
        });
    }

    async function retrieveDescription() {
        const descriptions = [];

        for (const item of uriList[0]) {
            try {
                const response = await fetch('http://localhost:5000/api/recognize_objects', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image_url: item
                    })
                });
    
                const data = await response.json();
                console.log(data, "test")
                try {
                    const response = await fetch('http://localhost:5000/api/cohere_caption', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    })

                    const final = await response.json()
                    descriptions.push(final);
                } catch (err){
                    console.log(err)
                }
    
            } catch (error) {
                console.error("ERROR:", error);
            }
        }
    
        // Update the context with all descriptions in one go
        addDesc(descriptions); // Assuming addDesc can handle an array of descriptions
        console.log(descriptions);
    }
    
    async function retrieveImages(token, albumId) {
        try {
            const response = await fetch(`http://localhost:5000/api/getAlbumItems`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token, album_id: albumId })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();

            await addUri(data.photo_uris);
        } catch (error) {
            console.error('Error fetching album photos:', error);
        }
    }

    useEffect(() => {
        if (uriList[0] && uriList[0].length > 0) {
          retrieveDescription().then(() => {
            navTo();
          });
        }
      }, [uriList, addDesc, navTo]);
      

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
    
            const returnedInfo = await retrieveImages(token, data.album_id);
            return returnedInfo;
    
        } catch (error) {
            console.error('Error sending token', error);
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
                    isSignedIn={false}/>

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