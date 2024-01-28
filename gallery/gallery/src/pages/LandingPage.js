import React from "react";
import { useNavigate } from 'react-router-dom';
import highway from "../assets/highway.png";
import "./LandingPage.css";

export default function LandingPage(){
    const navigate = useNavigate();
    function navTo(){
        navigate('/upload')
    }

    return(
        <div id = "landingPage">
            <div id = "title">
                <h1>REXFLECTION</h1>
                <h1>Take A Walk Down Memory Lane.</h1>
                <p>2023 wrapped? no problem.</p>
                <div id = "purple" className = "rectangle"></div>
                <div id = "red" className = "rectangle"></div>
                <div id = "orange" className = "rectangle"></div>
                <div id = "yellow" className = "rectangle"></div>
                <div id = "green" className = "rectangle"></div>
                <div id = "blue" className = "rectangle"></div>
                <button onClick={navTo}>Get Started.</button>
            </div>

            <img id = "highway" src = {highway}></img>
        </div>
    )
}