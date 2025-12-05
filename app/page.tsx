"use client"

import { homedir } from "os"


import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AForm from "./(frontend)/components/AForm/AForm";
import Card from "./(frontend)/components/Card/Card";

export default function TestTailwind() {
  useEffect(() => {
    AOS.init({ duration: 1200, });
  }, []);
  return (
    <>
      <section className="m-3 text-centerd    ">
        <div className=" md:grid md:grid-cols-2 gap-9 m-5 container mx-auto">
          <p className="text-7xl mb-3 pr-9" data-aos="fade-right">Precision Care for Better Health</p>
          <p className=" place-content-center md:ps-24" data-aos="fade-left">Good health isn’t just the absence of illness—it’s a balance of body, mind, and lifestyle. Our care philosophy blends medical expertise with a holistic understanding of your everyday life. Whether you’re improving mobility, managing discomfort, or simply seeking better health, we offer safe, effective, and individualized solutions that respect your pace and priorities</p>
        </div>
        <div className="container mx-auto relative" data-aos="fade-up">
          <img src="/abc.png" alt="banner" className="rounded-lg w-full h-5/6" />
          <div className=" absolute inset-0 
              flex justify-end items-start 
              px-10 md:px-16 py-10 
              text-persian-indigo bg-black/20 ">
              <div className="max-w-md text-right">
                  <h3 className="text-3xl sm:text-4xl md:text-7xl font-bold drop-shadow-2xl" data-aos="fade-right"> Find the Right Doctor for Your Needs</h3>
                  <p
                    className="mt-4 text-base md:text-lg drop-shadow-xl"
                    data-aos="fade-right"
                    data-aos-delay="200"
                  >
                    Easy appointments. Trusted healthcare.
                  </p>
              </div>
          </div>
          <AForm data-aos="fade-up" />

        </div>

        

        <div className="client-section ">

          {/* Heading Section */}
          <div className="container mx-auto mt-24 ">
            <h1 className="text-4xl md:text-6xl mb-3 pr-9 md:grid md:grid-cols-2 gap-9 m-5">
              Your Health, Our Commitment — Quality Care for Every Stage of Life
            </h1>
          </div>
          

          {/* Card Section */}
          <div className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-2
            lg:grid-cols-4 
            gap-6 
            p-5 
            container mx-auto
          ">
            <Card text="95%" subtext="High patient satisfaction" image="/review.jpg" />
            <Card text="20+ Years" subtext="Experienced doctors" image="/exp.jpg" />
            <div className="lg:col-span-2 md:col-span-2 rounded-xl overflow-hidden shadow-lg ">
              <video
                src="/explaine.mp4"  // your video file
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-64 sm:h-80 md:h-96 object-cover "
              ></video>
            </div>
          </div>
          
          <div className="our-services  bg-heliotrope w-full h-max mt-52 p-14  ">

            <div className="text-center">marque here </div>
            <div className=" grid grid-rows-5 place-content-center">
            <Card text="20+ Years" subtext="Experienced doctors" image="/exp.jpg" />

            </div>

          </div>
        

        </div>
      </section>
    </>
  )
}
