import { useEffect, useRef, useState } from "react";
import dinoRun1 from "../assets/dinoRun1.png";
import dinoRun2 from "../assets/dinoRun2.png";
import dinoStill from "../assets/dinoStill.png";
import tempbg from "../assets/tempbg.jpg";

import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.png";
import monalisa from "../assets/monalisa.jpg";

export default function Dino({canvasRef, canvasHeight, canvasWidth}){
    const [currentImg, setCurrentImg] = useState(dinoStill); 
    const [currentGalImage, setCurrentGalImage] = useState(monalisa)
    const [nextGalImage, setNextGalImage] = useState(image2)

    const imageLoader = [image1, image2, image3, image4]

    const currentImageIndex = useRef(0);
    const image = useRef(new Image());
    const keysPressed = useRef({});
    const backgroundPosition = useRef(0);
    const backgroundImg = useRef(new Image());
    const galImage = useRef(new Image());
    const secondGalImage = useRef(new Image());

    const galImagePosition = useRef(160)
    const galImageSecondPosition = useRef(160 + canvasWidth)

    const handleKeyDown = (e) => {
        keysPressed.current[e.key] = true;
    };

    const handleKeyUp = (e) => {
        keysPressed.current[e.key] = false;
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const updatePosition = () => {
        if (keysPressed.current['ArrowRight']){
            backgroundPosition.current -= 5;
            galImagePosition.current -= 5;
            galImageSecondPosition.current -= 5;
        }
        if (keysPressed.current['ArrowLeft']){
            backgroundPosition.current += 5;
            galImagePosition.current += 5;
            galImageSecondPosition.current += 5;
        }

        if (backgroundPosition.current < -canvasWidth) {
            backgroundPosition.current += canvasWidth;
        } else if (backgroundPosition.current > canvasWidth) {
            backgroundPosition.current -= canvasWidth;
        }

        if (galImagePosition.current < -canvasWidth) {
            galImagePosition.current += canvasWidth;
        } else if (galImagePosition.current > canvasWidth) {
            galImagePosition.current -= canvasWidth;
        }
    };
    
    useEffect(() => {
        image.current.src = currentImg;
        backgroundImg.current.src = tempbg;
        galImage.current.src = currentGalImage;
        secondGalImage.current.src = nextGalImage;
    }, [currentImg]);

    function moveBackground(){
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(backgroundImg.current, backgroundPosition.current, 0, canvasWidth, canvasHeight - 100);
        ctx.drawImage(backgroundImg.current, backgroundPosition.current + canvasWidth, 0, canvasWidth, canvasHeight - 100);

        ctx.drawImage(galImage.current, galImagePosition.current, 120, 190, 200)
        ctx.drawImage(galImage.current, galImagePosition.current + canvasWidth, 120, 190, 200)
        ctx.drawImage(secondGalImage.current, galImageSecondPosition.current, 120, 190, 200);
        ctx.drawImage(secondGalImage.current, galImageSecondPosition.current + canvasWidth, 120, 190, 200);
    
        ctx.drawImage(image.current, 150, 500, 50,50)
    }

    function changeDinoImage(){
        if(keysPressed.current['ArrowRight'] || keysPressed.current['ArrowLeft']){
            setCurrentImg(prevImg => (prevImg === dinoRun1 ? dinoRun2 : dinoRun1));
        } else {
            setCurrentImg(dinoStill)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            updatePosition();
            moveBackground();
            changeDinoImage()
        }, 20);

        return () => clearInterval(interval);
    }, [currentImg]);

    return null;
}