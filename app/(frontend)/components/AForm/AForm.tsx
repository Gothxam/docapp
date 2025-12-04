"use client"
import AOS from "aos"
import { useEffect } from "react";


export default function AForm() {
   useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);
  return (
    
     <div 
     data-aos="fade-up"
       className="
    bg-amethyst/40 backdrop-blur-xl 
    p-10 rounded-3xl shadow-2xl 
    border border-white/30

    w-full max-w-md md:max-w-lg   

    /* Overlay only on large screens */
    lg:absolute lg:bottom-10 lg:left-10    

    /* Normal flow on mobile + medium screens */
    mt-5 mx-auto
    
  "
    >
      <h2 className="text-2xl font-semibold mb-4 text-white">
        Book Appointment
      </h2>

      <form className="space-y-3">
        <div>
          <label className="text-white text-sm">Name</label>
          <input 
            type="text" 
            className="w-full p-2 rounded-lg bg-white/30 text-white placeholder-gray-200"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="text-white text-sm">Date</label>
          <input 
            type="date" 
            className="w-full p-2 rounded-lg bg-white/30 text-white"
          />
        </div>

        <div>
          <label className="text-white text-sm">Symptoms</label>
          <textarea
            className="w-full p-2 rounded-lg bg-white/30 text-white placeholder-gray-200"
            placeholder="Describe your issue"
            rows={4} 
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full mt-2 bg-tekhelet hover:bg-persian-indigo text-white p-2 rounded-lg"
        >
          Book Now
        </button>
      </form>
    </div>
  );
}
