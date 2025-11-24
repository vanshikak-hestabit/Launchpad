import React from "react"; 
  
export default function TakeInput() {

    return(
        <div className="flex items-center gap-2">

            <span className="text-xl text-black">Search:</span>

           <div className="bg-white px-6 py-2 mb-2 rounded-md border border-gray-300">
             <input 
                type="text"
                className="text-gray-700 outline-none"
            />
            </div>
      </div>
    );
}
