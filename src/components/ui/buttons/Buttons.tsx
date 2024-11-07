import React, { FC } from "react";
import styles from "./Buttons.module.css"
interface IButton {
    onClick?: ()=>void;
    children: React.ReactNode
    buttonColor: string
}
export const Buttons:FC<IButton> = ({onClick, buttonColor: borderColor, children}:IButton) => {
    return (
        <button onClick={onClick} className={styles.button} style={{border: "2px solid #"+borderColor}}>
            <div style={{color:"#"+borderColor}}>
                {children} 
            </div>
        </button>
    )
}

export default Buttons;