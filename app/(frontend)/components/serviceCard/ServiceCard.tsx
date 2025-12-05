// components/Card.jsx
'use client'

interface CardProps {
  text: string;
  subtext: string;
  image?: string;
}

export default function Card({ text, subtext, image,  }: CardProps) {
  return (
      <div
      className="
        lg:w-3/6
        lg:hover:w-full
        h-80                /* Mobile height */
        sm:h-80           /* Tablet height */
        lg:h-96           /* Desktop height */
        rounded-2xl overflow-hidden 
        group cursor-pointer relative
        transition-all duration-500
        

      "
    >
      <div className="h-full w-full overflow-hidden shadow-[inset_0px_-50px_20px_0px_black]">
        <img
          src={image}
          alt={text}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 "
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent"></div>

      <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 sm:p-5 md:p-6">
        <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold drop-shadow-lg">
          {text}
        </h2>
        {subtext && (
          <p className="text-gray-200 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base drop-shadow">
            {subtext}
          </p>
        )}
      </div>

    </div>
  );
}
