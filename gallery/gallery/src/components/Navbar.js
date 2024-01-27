import React from "react";
import { GoogleLogout } from "react-google-login";
import { useNavigate } from 'react-router-dom';
import "./Navbar.css";

export default function Navbar(){
    const clientId = "1044768649244-j1qtke8g728no98ug6qrsu276qt6tmld.apps.googleusercontent.com"
    const navigate = useNavigate();
    function navTo(){
        navigate('/')
    }

    function onSuccess(){
        console.log("Success!")
        navigate('/')
    }

    return(
        <div className = "navBar">
            <div id = "logout">
                <GoogleLogout
                    clientId = {clientId}
                    buttonText = {"Logout"}
                    onLogoutSuccess={onSuccess}/>
            </div>
            <p onClick = {navTo}>Homepage</p>
            <p>About</p>
        </div>
    )
}