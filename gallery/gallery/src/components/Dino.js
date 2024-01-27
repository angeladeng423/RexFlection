import { useEffect, useRef, useState } from "react";
import dinoRun1 from "../assets/dinoRun1.png";
import dinoRun2 from "../assets/dinoRun2.png";
import dinoStill from "../assets/dinoStill.png";
import monalisa from "../assets/monalisa.jpg";
import tempbg from "../assets/tempbg.jpg";

export default function Dino({canvasRef, canvasHeight, canvasWidth}){
    const [currentImg, setCurrentImg] = useState(dinoStill); 
    const image = useRef(new Image());
    const keysPressed = useRef({});
    const backgroundPosition = useRef(0);
    const backgroundImg = useRef(new Image());
    const monalisaImg = useRef(new Image());
    const monalisaPosition = useRef(160)

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
            monalisaPosition.current -= 5;
        }
        if (keysPressed.current['ArrowLeft']){
            backgroundPosition.current += 5;
            monalisaPosition.current += 5;
        }

        if (backgroundPosition.current < -canvasWidth) {
            backgroundPosition.current += canvasWidth;
        } else if (backgroundPosition.current > canvasWidth) {
            backgroundPosition.current -= canvasWidth;
        }
    };
    
    useEffect(() => {
        image.current.src = currentImg;
        backgroundImg.current.src = tempbg;
        monalisaImg.current.src = monalisa;
    }, [currentImg]);

    function moveBackground(){
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(backgroundImg.current, backgroundPosition.current, 0, canvasWidth, canvasHeight - 100);
        ctx.drawImage(backgroundImg.current, backgroundPosition.current + canvasWidth, 0, canvasWidth, canvasHeight - 100);

        ctx.drawImage(monalisaImg.current, monalisaPosition.current, 120, 190, 200)
    
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
        }, 50);

        return () => clearInterval(interval);
    }, [currentImg]);

    return null;
}