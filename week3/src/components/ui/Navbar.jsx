'use client'
import {useRouter} from 'next/navigation'
import React from 'react'

const Navbar = () => {
  const router = useRouter();
  return (

    <div className="w-full bg-gray-700 text-white px-6 py-4 flex items-center justify-between"> 

      <div className="flex items-center gap-18">
        <h1 className="text-2xl font-black">Start Travelling</h1> 
        <span className="text-2xl cursor-pointer">☰</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-white px-6 py-2 rounded-md">
          <input 
            type="text"
            placeholder="Search for..."
            className="text-gray-700 outline-none"
          />
        </div>
        
        <div className="flex items-center justify-center cursor-pointer"
         onClick ={() => router.push("/dashboard/profile")}>            <span className=
            "text-xl">👤</span> 
        </div>
      </div>
    </div>
  )
}

export default Navbar
