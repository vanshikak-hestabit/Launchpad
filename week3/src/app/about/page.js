"use client";

export default function About() {
  return (
    <div className="relative p-4 leading-relaxed">

      <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl mt-3 mx-2 sm:mx-4 tracking-tight">
        About Us
      </h1>

      {/* Norway*/}
      <div className="flex flex-col md:flex-row items-center gap-6 mt-8">

        <img
          src="https://i0.wp.com/handluggageonly.co.uk/wp-content/uploads/2014/12/Hand-Luggage-Only-4.jpg?resize=1000%2C663&ssl=1"
          alt="Norway"
          className="w-full md:w-1/3 rounded shadow-md"
        />

        <article className="text-lg sm:text-xl text-gray-700 leading-relaxed px-1 sm:px-2">
          Welcome to <span className="font-semibold text-gray-900">WanderSphere Travels</span>,
          your trusted partner for discovering the world in the most seamless,
          meaningful, and memorable way. <br /><br />
          We believe travel isn’t just about destinations — it’s about stories,
          people, and experiences that stay with you forever.
        </article>
      </div>

      {/*Scotland */}
      <div className="flex flex-col md:flex-row items-center gap-6 mt-14">

        <img
          src="https://t3.ftcdn.net/jpg/05/69/09/70/360_F_569097021_SKtwlCm25puNH5xZ0u1LRF5a2Vqm8637.jpg"
          alt="Scotland"
          className="w-full md:w-1/3 rounded shadow-md"
        />

        <div className="w-full">
          <h2 className="font-semibold text-3xl sm:text-4xl mb-4 mx-2 sm:mx-8 tracking-tight">
            What We Do?
          </h2>

          <ul className="text-lg sm:text-xl text-gray-700 leading-relaxed list-disc pl-6 sm:pl-12 space-y-2">
            <li>Help travelers discover the best destinations across the world.</li>
            <li>Provide curated guides, travel tips, and itinerary suggestions.</li>
            <li>Offer both budget-friendly and luxury travel recommendations.</li>
            <li>Connect travelers with authentic local experiences.</li>
            <li>Make planning stress-free from start to finish.</li>
          </ul>
        </div>
      </div>

      {/*  Japan */}
      <div className="flex flex-col md:flex-row items-center gap-6 mt-14">

        <div className="flex-1 text-gray-700 order-2 md:order-1">
          <h2 className="font-semibold text-3xl sm:text-4xl mx-2 sm:mx-4 tracking-tight">
            Questions You Might Have
          </h2>

          <h3 className="font-semibold text-2xl sm:text-3xl mx-2 sm:mx-4 mt-6">
            Who Are We?
          </h3>
          <p className="text-lg sm:text-xl mt-2 mx-2 sm:mx-4 leading-relaxed">
            A team of passionate explorers who want to help others travel smarter.
          </p>

          <h3 className="mx-2 sm:mx-4 font-semibold text-2xl sm:text-3xl mt-6">
            Why Choose Us?
          </h3>
          <p className="text-lg sm:text-xl mt-2 mx-2 sm:mx-4 leading-relaxed">
            Because we turn overwhelming planning into simple decisions —
            personalized just for you.
          </p>

          <h3 className="mx-2 sm:mx-4 font-semibold text-2xl sm:text-3xl mt-6">
            What Makes Us Different?
          </h3>
          <p className="text-lg sm:text-xl mx-2 sm:mx-4 mt-2 leading-relaxed">
            Real travel insights, genuine recommendations, and no fake reviews.
            Only honest guidance from real travelers.
          </p>
        </div>

        <img
          src="https://cdn1.matadornetwork.com/blogs/1/2011/05/japan-1200x729.jpg"
          alt="Japan"
          className="w-full md:w-1/3 rounded shadow-md order-1 md:order-2"
        />
      </div>

      {/*  NZ */}
      <img
        src="https://images.unsplash.com/photo-1502786129293-79981df4e689"
        alt="New Zealand"
        className="w-full h-56 sm:h-72 md:h-96 object-cover rounded mt-16 mb-10 shadow-lg"
      />
    </div>
  );
}
