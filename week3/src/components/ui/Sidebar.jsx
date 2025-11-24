"use client"
import React from 'react'
import { FaTachometerAlt, FaHome, FaInfoCircle, FaRegFileAlt, FaChartBar, FaTable } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from 'next/navigation';


const Sidebar = () => {
    const router = useRouter();
  return (
   
    <div className="w-80 bg-gray-800 text-white p-9 flex-shrink-0 overflow-y-auto">

        {/* CORE */}
        <p className="text-gray-500 text-xl mb-3">Core</p>
        <div>
            <div className="flex items-center gap-3 text-xl mb-4 cursor-pointer"
                onClick={() => router.push("/dashboard")}>
                <FaTachometerAlt/>
                <span>Dashboard</span>
            </div>

            <div className="flex items-center gap-3 text-xl mb-4 cursor-pointer"
                onClick={() => router.push("/")}>
                <FaHome/>
                <span>Home</span>
            </div>    

            <div className="flex items-center gap-3 text-xl mb-8 cursor-pointer"
                onClick={() => router.push("/about")}>
                <FaInfoCircle/>
                <span>About</span>
            </div>          
        </div>

        {/* INTERFACE */}
        <p className="text-gray-500 text-xl mb-4">Interface</p>
        <div className="flex items-center justify-between text-xl gap-3 cursor-pointer mb-4">
            <div className="flex items-center gap-3">
                <FaRegFileAlt />
                <span>Layouts</span>
            </div>
            <FaArrowRight />
        </div>
        <div className="flex gap-3 items-center justify-between text-xl mb-8">
            <div className="flex items-center gap-3">
                <FaRegFileAlt />
                <span>Pages</span>
            </div>
            <FaArrowRight />
        </div>
        

        {/* ADDONS */}
        <p className="text-gray-500 text-xl mb-4">Addons</p>
        <div className="flex gap-3 text-xl cursor-pointer mb-4">
            <FaChartBar />
            <span>Charts</span>
        </div>
        <div className="flex gap-3 cursor-pointer text-xl">
            <FaTable />
            <span>Tables</span>
        </div>
      
    </div>
  )
}

export default Sidebar
