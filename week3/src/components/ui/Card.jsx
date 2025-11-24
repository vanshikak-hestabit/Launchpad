import React from "react";
import {FaArrowRight} from "react-icons/fa";

export default function Card({ title, text, bg, onArrowClick, classes}) {
    return(
        <div className={`${bg} text-white p-2 rounded-xl ${classes}`}>
            <h3 className="font-bold text-xl mt-5 mx-3">{title}</h3>
            <div className="mt-9 mb-2 -mx-6 h-0.5 bg-white/40"></div>
            <div className="flex justify-between mt-6">
                <p className="mb-3 mx-2">{text}</p>
                <FaArrowRight className="mt-1 cursor-pointer" onClick={onArrowClick} />

            </div>
        </div>
    )
}