'use client'

interface CardProps {
  text: string;
  subtext: string;
  image?: string;
  description?: string;   // NEW PROP
}

export default function Card({ text, subtext, image, description }: CardProps) {
  return (
    <div
      className="
         group
    bg-white
    rounded-3xl
    shadow-xl
    w-[70rem]
    max-w-4xl
    h-80
    flex flex-row
    items-center
    justify-between
    p-10
    gap-10
    transition-all duration-500
    hover:max-w-6xl
    cursor-pointer
      "
    >

      {/* LEFT SIDE CONTENT (does NOT fade) */}
      <div className="flex flex-col gap-4 w-full md:w-1/4">
        <h2 className="text-4xl font-semibold text-gray-900 leading-snug">
          {text}
        </h2>

        <p className="text-lg text-gray-600">{subtext}</p>

        <button className="
          px-6 py-3
          border border-gray-300
          rounded-xl
          text-green-900
          hover:bg-green-100
          transition
        ">
          Read More
        </button>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div className="relative flex-1 h-full overflow-hidden rounded-2xl">
  <img
    src={image}
    alt={text}
    className="
      w-full
      h-full
      place-content-end
      object-cover
      rounded-2xl
      transition-transform duration-700
      group-hover:scale-110
    "
  />

        {/* HOVER OVERLAY WITH DESCRIPTION */}
         <div
    className="
      absolute inset-0
      bg-black/40
      opacity-0
      group-hover:opacity-100
      transition-all duration-500
      flex flex-col justify-end p-6
    "
  >
    <p className="text-white text-lg leading-relaxed">{description}</p>
  </div>
</div>

    </div>
  );
}
