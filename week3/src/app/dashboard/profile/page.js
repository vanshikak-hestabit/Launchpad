"use client"
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-x-hidden">

      {/*TOP BANNER*/}
      <div
        className="w-full h-64 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1600&q=80')",
        }}
      ></div>

      {/*PROFILE CARD */}
      <div className="w-[92%] mx-auto -mt-20 bg-white p-6 rounded-xl shadow-md">

        {/* Profile Image */}
        <div className="flex flex-col items-center text-center">
          
          {/* Circle Image*/}
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md -mt-16">
            <img
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=80"
              alt="Sarah Williams"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <h1 className="mt-4 text-3xl font-semibold">Sarah Williams</h1>
          <p className="text-gray-600">
            Senior Travel Planner • Winter & Adventure Trip Specialist
          </p>

          <div className="flex gap-10 mt-6 text-gray-700 font-semibold">
            <p>
              <span className="text-xl font-bold">7+</span>
              <br />
              <span className="text-sm font-normal text-gray-500">
                Years Experience
              </span>
            </p>

            <p>
              <span className="text-xl font-bold">250+</span>
              <br />
              <span className="text-sm font-normal text-gray-500">
                Trips Planned
              </span>
            </p>

            <p>
              <span className="text-xl font-bold">18+</span>
              <br />
              <span className="text-sm font-normal text-gray-500">
                Countries Explored
              </span>
            </p>
          </div>
          <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            onClick = {() => router.push("/login")}>
            Plan a Trip With Me
          </button>

        </div>
      </div>

      

      {/* ---- ABOUT---- */}
      <div className="w-[92%] mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-3">About Me</h3>

        <p className="text-gray-700 leading-relaxed">
          Hey! I'm Sarah — a passionate travel planner who loves creating unforgettable
          journeys for adventurers and families. I specialize in <b>winter trips</b>,
          snow adventures, northern lights tours, and cozy cabin experiences.
        </p>

        <p className="text-gray-700 leading-relaxed mt-3">
          Planning, researching, and curating the perfect itinerary is what excites me
          the most. From picking hidden gems to optimizing routes, I ensure every traveler
          feels confident and relaxed while exploring the world.
        </p>
      </div>

    </div>
  );
}
