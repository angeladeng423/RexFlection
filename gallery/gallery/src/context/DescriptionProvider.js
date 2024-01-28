import React, { useState } from "react";
import DescriptionContext from "./DescriptionContext";

const DescriptionProvider = ({ children }) => {
    const [descList, setDescList] = useState([]);

    const addDesc = (desc) => {
        setDescList([...descList, desc])
    }

    const removeDesc = (desc) => {
        setDescList(descList.filter((i) => i !== desc))
    }

    return (
        <DescriptionContext.Provider value = {{descList, addDesc, removeDesc}}>
            {children}
        </DescriptionContext.Provider>
    )
}

export default DescriptionProvider;