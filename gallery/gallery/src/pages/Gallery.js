import React from "react";
import GalleryBg from "../components/GalleryBg";
import Navbar from "../components/Navbar";
import "./Gallery.css";

export default function Gallery(){
    return(
        <div id = "gallery">
            <Navbar/>
            <div id = "canvas">
                <GalleryBg/>
            </div>
        </div>
    )
}