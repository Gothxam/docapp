'use client'
import { SiCodepen, SiFacebook, SiGithub, SiInstagram, SiX } from '@icons-pack/react-simple-icons'
import { Linkedin } from 'lucide-react'
import { GiHospitalCross } from "react-icons/gi";

export const languages = ['En', 'Es', 'Fr', 'De', 'Ru']

export const footerLinks = [
  { title: 'About', href: '#' },
  { title: 'Projects', href: '#projects' },
  { title: 'Testimonials', href: '#testimonials' },
  {
    title: 'Blogs',
    href: '#blogs',
  },
  {
    title: 'Services',
    href: '#services',
  },
  {
    title: 'Contact',
    href: '#contact',
  },
]

export const socials = [
  { href: '/', icon: <SiGithub /> },
  { href: '/', icon: <Linkedin /> },
  { href: '/', icon: <SiCodepen /> },
  { href: '/', icon: <SiX /> },
  { href: '/', icon: <SiInstagram /> },
  { href: '/', icon: <SiFacebook /> },
]

const Footer = () => {
  return (
    <footer className="relative flex min-h-[560px] flex-col justify-between gap-20 overflow-hidden bg-persian-indigo px-4 py-14 md:p-14 rounded-lg">
      <div className="relative z-20 grid grid-cols-1 items-start gap-20 md:grid-cols-2 md:gap-12">
        <div>
          <h5 className="mb-8">
            <a href="javascript:void(0)" className="flex items-center gap-2 text-2xl text-white">
             <GiHospitalCross />
              <span className="text-lg font-medium text-white">MedApp</span>
            </a>
          </h5>
          <p className="text-[#99a1af]">
            A complete healthcare companion designed to simplify appointments, insights, and patient care.
            Secure, fast, and built for clinics of all sizes.
            Your health, managed smarter.
          </p>
          
        </div>

        <div className="flex flex-wrap gap-8">
          {footerLinks.map((link) => (
            <a
              href="javascript:void(0)"
              key={link.href}
              className="text-[#99a1af] transition-colors duration-300 hover:text-white hover:underline"
            >
              {link.title}.
            </a>
          ))}
        </div>
      </div>

      <div className="relative z-20 flex flex-col-reverse gap-20 md:grid md:grid-cols-2 md:gap-12">
        <div className="grid grid-cols-2 gap-4">
          <ul className="flex flex-col gap-4">
            {socials.map((item, index) => (
              <li key={index} className="cursor-pointer bg-transparent">
                <a
                  href="javascript:void(0)"
                  className="transition-color h-full w-full text-white duration-300 hover:text-white/50"
                >
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>
          <p className="flex flex-col self-end text-right text-xs text-[#99a1af] md:text-center">
            <span>© 2025 — Copyright</span>
            <span>All Rights reserved</span>
          </p>
        </div>

        <div className="flex flex-col justify-between gap-[200px] md:flex-row md:gap-8">
          <div className="space-y-10 md:self-end">
            <div className="flex flex-col">
              <h5 className="mb-4 text-lg font-medium text-white">Contact Us</h5>
              <a
                href="mailto:johndoe@gmail.com"
                className="text-sm font-light text-[#99a1af] transition-colors duration-300 hover:text-white"
              >
                medapp@gmail.com
              </a>
              <a
                href="tel:+92 3123456789"
                className="text-sm font-light text-[#99a1af] transition-colors duration-300 hover:text-white"
              >
                +91 1234567890
              </a>
            </div>
            <div>
              <div>
                <h5 className="mb-4 text-lg font-medium text-white">Location</h5>
                <address className="flex flex-col text-sm font-light text-[#99a1af]">
                  <span>123456, inida</span>
                  <span>sector 8, Chandigarh</span>
                </address>
              </div>
            </div>
          </div>

          <div className="md:self-end">
            <p className="mb-8 text-sm text-white md:text-right">Languages</p>
            <div className="flex gap-8 md:gap-4 lg:gap-8">
              {languages.map((language, idx) => (
                <span key={language} className={idx === 0 ? 'text-white' : 'text-[#99a1af]'}>
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 -right-[40%] z-0 h-[120dvw] w-[120dvw] -translate-y-1/2 rounded-full bg-white/4 p-14 md:top-0 md:-right-[255px] md:-bottom-[450px] md:size-[1030px] md:-translate-y-0 md:p-20">
        <div className="size-full rounded-full bg-white/4 p-14 md:p-20">
          <div className="size-full rounded-full bg-white/5" />
        </div>
      </div>
    </footer>
  )
}

export default Footer