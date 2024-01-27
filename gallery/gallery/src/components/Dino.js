import { useEffect, useRef } from "react";
import dinoStill from "../assets/dinoStill.png";
import tempbg from "../assets/tempbg.jpg";

export default function Dino({canvasRef}){
    const image = useRef(new Image());
    const keysPressed = useRef({});
    const backgroundPosition = useRef(0);
    const backgroundImg = useRef(new Image());

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
        if (keysPressed.current['ArrowRight']) backgroundPosition.current -= 5;
        if (keysPressed.current['ArrowLeft']) backgroundPosition.current += 5;

        if (backgroundPosition.current < -400) {
            backgroundPosition.current += 400;
        } else if (backgroundPosition.current > 400) {
            backgroundPosition.current -= 400;
        }
    };
    
    useEffect(() => {
        image.current.src = dinoStill;
        backgroundImg.current.src = tempbg;
    }, [dinoStill]);

    function moveBackground(){
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image.current, 20,350, 50,50)

        ctx.drawImage(backgroundImg.current, backgroundPosition.current, 0);
        ctx.drawImage(backgroundImg.current, backgroundPosition.current + 400, 0)
    }

    function changeDinoImage(){
        
    }

    useEffect(() => {
        const interval = setInterval(() => {
            updatePosition();
            moveBackground();
            changeDinoImage()
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return null;
}