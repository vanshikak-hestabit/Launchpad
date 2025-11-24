"use client";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative w-full overflow-x-hidden">

      {/* HERO SECTION*/}
      <div className="relative w-full h-[300px] sm:h-[380px] md:h-[450px] overflow-hidden">

        {/* Image */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Beach"
          className="w-full h-full object-cover transition-transform duration-[5000ms] hover:scale-110"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10"></div>

        {/* Heading */}
        <h1 className="absolute inset-0 flex items-center justify-center text-center text-white font-bold text-3xl sm:text-4xl md:text-5xl px-4" >
          Welcome to WanderSphere Travels
        </h1>
      </div>

      {/* INTRO*/}
      <div className="mt-12 text-center px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide">
          Having trouble planning a trip?
        </h2>

        <p className="text-lg sm:text-xl md:text-2xl mt-4 leading-relaxed opacity-90">
          Don’t worry — let our experts design the perfect journey for you.
          From destinations to budgets, we handle everything.
        </p>

        <button onClick={() => router.push("/login")} className="mt-6 bg-blue-900 hover:bg-blue-700 text-white text-lg sm:text-xl px-6 sm:px-8 py-3 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105hover:shadow-blue-500/40">
          Book With Us
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 mt-10">
        {/* Card 1 */}
        <div className="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl rounded-xl">
          <Card
            classes="w-full"
            title="About Us"
            text="Know about us"
            bg="bg-red-300"
            onArrowClick={openModal}
          />
        </div>

        {/* Card 2 */}
        <div className="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl rounded-xl">
          <Card
            classes="w-full"
            title="Where to go?"
            text="Best for you"
            bg="bg-blue-300"
            onArrowClick={openModal}
          />
        </div>

        {/* Card 3 */}
        <div className="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl rounded-xl">
          <Card
            classes="w-full"
            title="Family, Solo & Friends"
            text="Customise your package"
            bg="bg-orange-300"
            onArrowClick={openModal}
          />
        </div>

        {/* Card 4 */}
        <div className="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl rounded-xl">
          <Card
            classes="w-full"
            title="Meet Us"
            text="Contact"
            bg="bg-green-300"
            onArrowClick={openModal}
          />
        </div>
      </div>

      <Modal open={isModalOpen} close={closeModal} content={""} />

    {/* FOOTER */}
      <footer className="mt-auto w-full bg-gray-800 text-white py-5 text-center">
        <p className="text-lg">© 2025 WanderSphere Travels</p>
        <p className="opacity-80 text-sm mt-1">Explore. Experience. Enjoy.</p>

      </footer>
    </div>
  );
}
