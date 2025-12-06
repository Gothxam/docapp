'use client'

interface CardProps {
  text: string;
  subtext: string;
  image?: string;
  description?: string;
}

export default function Card({ text, subtext, image, description }: CardProps) {
  return (
    <div
      className="
        group
        w-full
        bg-white
        rounded-xl
        shadow-md
        p-4
        gap-4
        flex flex-col items-start
        md:flex-row md:items-center md:p-10 md:gap-10 md:h-80
        lg:max-w-4xl lg:mx-auto lg:rounded-3xl lg:shadow-xl
        transform transition-all duration-500
        hover:max-w-5xl hover:shadow-2xl
        cursor-pointer
        overflow-visible
      "
    >

      {/* LEFT SIDE CONTENT (mobile: top) */}
      <div className="w-full md:w-1/4 order-1 md:order-none flex flex-col items-center text-center md:items-start md:text-left">
        <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 leading-snug mb-3 md:mb-0">
          {text}
        </h2>

        <p className="text-sm md:text-lg text-gray-600 hidden md:block">{subtext}</p>

        <div className="flex w-full md:w-auto justify-center md:justify-start mt-2 md:mt-0">
          <button className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-green-900 hover:bg-green-50 transition">
            Read More
          </button>
        </div>
      </div>

      {/* IMAGE (mobile: below) */}
      <div className="relative w-full md:flex-1 overflow-hidden rounded-lg md:rounded-2xl h-44 md:h-full mt-4 md:mt-0">
        <img
          src={image}
          alt={text}
          className="w-full h-full object-cover rounded-lg md:rounded-2xl transition-transform duration-700 group-hover:scale-110"
        />

        {/* OVERLAY: visible on mobile, hover only on md+ */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 md:p-6 transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <p className="text-white text-sm md:text-lg leading-relaxed">{description}</p>
        </div>
      </div>

    </div>
  );
}

    // group
    // bg-white
    // rounded-xl
    // shadow-xl
    // w-full
    // max-w-4xl
    // h-80
    // flex flex-row
    // items-center
    // justify-between
    // p-10
    // gap-10
    // transition-all duration-500
    // hover:max-w-6xl
    // cursor-pointer