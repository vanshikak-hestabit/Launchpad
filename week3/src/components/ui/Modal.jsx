import React from "react";

export default function Modal({ open, close, content }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">

      {/* MODAL BOX */}
      <div className="bg-white p-6 rounded-xl text-center 
                      w-full max-w-md sm:max-w-lg lg:max-w-xl">

        <h2 className="text-2xl font-semibold mb-3 ">{content}</h2>

        <p className="text-lg text-gray-700 mb-6">
          No data found for this card. Please come again later.
        </p>

        <button
          onClick={close}
          className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>

    </div>
  );
}
