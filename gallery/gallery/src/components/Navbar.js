import React from "react";
import { useNavigate } from 'react-router-dom';
import "./Navbar.css";

export default function Navbar(){
    const navigate = useNavigate();
    function navTo(){
        navigate('/')
    }

    return(
        <div className = "navBar">
            <p onClick = {navTo}>Homepage</p>
            <p>About</p>
        </div>
    )
}