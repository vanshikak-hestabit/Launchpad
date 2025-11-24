"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import TakeInput from "@/components/ui/Input";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="w-full">
      <h1 className="font-bold text-4xl mb-6">Dashboard</h1>

      {/* CARDS — FIXED LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card classes="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl rounded-xl"
          title="Primary Card"
          text="Quick summary or value"
          bg="bg-blue-800"
          onArrowClick={openModal}
        />

        <Card classes="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl rounded-xl"
          title="Success Card"
          text="Reach the top"
          bg="bg-green-600"
          onArrowClick={openModal}
        />

        <Card classes="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl rounded-xl"
          title="Warning"
          text="What not to do"
          bg="bg-yellow-600"
          onArrowClick={openModal}
        />

        <Card classes="transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl rounded-xl"
          title="Danger"
          text="View details"
          bg="bg-red-700"
          onArrowClick={openModal}
        />
      </div>

      <Modal open={isModalOpen} close={closeModal} />

      {/* INPUT BOTTOM RIGHT */}
      <div className="absolute bottom-4 right-4">
        <TakeInput />
      </div>
    </div>
  );
}
