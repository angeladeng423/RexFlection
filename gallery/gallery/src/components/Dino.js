import { useEffect, useRef, useState } from "react";
import dinoRun1 from "../assets/dinoRun1.png";
import dinoRun2 from "../assets/dinoRun2.png";
import dinoStill from "../assets/dinoStill.png";
import endBg from "../assets/endBg.png";
import tempbg from "../assets/tempbg.png";

import { useContext } from "react";
import ImageContext from "../context/ImageContext";

export default function Dino({canvasRef, canvasHeight, canvasWidth}){
    const { uriList } = useContext(ImageContext)
    
    const [reachedEnd, setReachedEnd] = useState(false);
    const [currentImg, setCurrentImg] = useState(dinoStill);

    const [galImageIndex, setGalImageIndex] = useState(0);
    const [secondImageIndex, setSecondImageIndex] = useState(2);

    const keysPressed = useRef({});
    const imagePosition = useRef(400)
    const backgroundPosition = useRef(0);

    const image = useRef(new Image());
    const backgroundImg = useRef(new Image());
    const galImage = useRef(new Image());
    const secondGalImage = useRef(new Image());
    const lowerImage = useRef(new Image());
    const nextLowerImage = useRef(new Image());
    const endImage = useRef(new Image());
    endImage.current.src = endBg;

    const velocity = useRef(0);
    const gravity = -2;

    const jumpVelocity = 30;

    const galImagePosition = useRef(160)
    const lowerImagePosition = useRef(627)
    const nextLowerImagePosition = useRef(627 + canvasWidth)
    const galImageSecondPosition = useRef(160 + canvasWidth)

    const handleKeyDown = (e) => {
        keysPressed.current[e.key] = true;
    };

    const handleKeyUp = (e) => {
        keysPressed.current[e.key] = false;
    };

    useEffect(() => {
        console.log(uriList[0])

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
            lowerImagePosition.current -= 5;
            galImageSecondPosition.current -= 5;
            nextLowerImagePosition.current -=5;
        }
        if (keysPressed.current['ArrowUp'] && imagePosition.current >= 500) {
            velocity.current = jumpVelocity;
        }
    
        velocity.current += gravity;
        imagePosition.current -= velocity.current;
    
        if (imagePosition.current > 500) {
            imagePosition.current = 500;
            velocity.current = 0;
        }

        if (backgroundPosition.current < -canvasWidth) {
            backgroundPosition.current += canvasWidth;
        }

        if (galImagePosition.current < -canvasWidth) {
            if (galImageIndex < uriList[0].length - 1) {
                galImagePosition.current += canvasWidth * 2;
                setGalImageIndex(galImageIndex => galImageIndex + 4);
            } else {
                setReachedEnd(true);
            }
        }
        
        if (galImageSecondPosition.current < -canvasWidth) {
            if(galImageIndex < uriList[0].length - 1){
                galImageSecondPosition.current += canvasWidth * 2;
                setSecondImageIndex(secondImageIndex => secondImageIndex + 4);
            } else {
                setReachedEnd(true);
            }
        }
        
        if (lowerImagePosition.current < -canvasWidth) {
            lowerImagePosition.current += canvasWidth*2;
        }

        if (nextLowerImagePosition.current < -canvasWidth) {
            nextLowerImagePosition.current += canvasWidth*2;
        }
    };
    
    useEffect(() => {
        image.current.src = currentImg;
        backgroundImg.current.src = tempbg;
    
        galImage.current.src = uriList[0][galImageIndex];
        lowerImage.current.src = uriList[0][(galImageIndex + 1)];
        secondGalImage.current.src = uriList[0][secondImageIndex];
        nextLowerImage.current.src = uriList[0][(secondImageIndex + 1)];
    }, [currentImg, galImageIndex, secondImageIndex]);    

    function moveBackground(){
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!reachedEnd) {
            ctx.drawImage(backgroundImg.current, backgroundPosition.current, 0, canvasWidth, canvasHeight - 100);
            ctx.drawImage(backgroundImg.current, backgroundPosition.current + canvasWidth, 0, canvasWidth, canvasHeight - 100);

            ctx.drawImage(galImage.current, galImagePosition.current, 115, 190, 205)
            ctx.drawImage(secondGalImage.current, galImageSecondPosition.current, 115, 190, 205);
            ctx.drawImage(lowerImage.current, lowerImagePosition.current, 175, 200, 205);
            ctx.drawImage(nextLowerImage.current, nextLowerImagePosition.current, 175, 200, 205);
        } else {
            ctx.drawImage(endImage.current, 0, 0, canvasWidth, canvasHeight);
        }
    
        ctx.drawImage(image.current, 150, imagePosition.current, 50, 50);
    }

    function changeDinoImage(){
        if(keysPressed.current['ArrowRight']){
            setCurrentImg(prevImg => (prevImg === dinoRun1 ? dinoRun2 : dinoRun1));
        } else {
            setCurrentImg(dinoStill)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (!reachedEnd) {
                updatePosition();
                moveBackground();
                changeDinoImage();
            }
        }, 5);
    
        return () => clearInterval(interval);
    }, [currentImg, reachedEnd]);
    
    return null;
}