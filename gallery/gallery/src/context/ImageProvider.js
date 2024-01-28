import React, { useState } from "react";
import ImageContext from "./ImageContext";

const ImageProvider = ({ children }) => {
    const [uriList, setUriList] = useState([]);

    const addUri = (uri) => {
        setUriList([...uriList, uri])
    }

    const removeUri = (uri) => {
        setUriList(uriList.filter((i) => i !== uri))
    }

    return (
        <ImageContext.Provider value = {{uriList, addUri, removeUri}}>
            {children}
        </ImageContext.Provider>
    )
}

export default ImageProvider;