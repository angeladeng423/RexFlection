import React, { useEffect, useRef } from "react";
import Dino from "./Dino.js";
import "./GalleryBg.css";

export default function GalleryBg(){
    const canvasRef = useRef(null)
    const dinoRef = useRef(null)
    const CANVAS_WIDTH = 1000
    const CANVAS_HEIGHT = 600

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
    }, []);


    return(
        <div>
            <canvas ref = {canvasRef} id = "galleryCanvas" width = {CANVAS_WIDTH} height = {CANVAS_HEIGHT}></canvas>
            <Dino canvasRef = {canvasRef} canvasHeight={CANVAS_HEIGHT} canvasWidth={CANVAS_WIDTH}/>
        </div>
    )
}