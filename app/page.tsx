"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, Clock, Shield, ArrowRight, Stethoscope, Calendar, Lock } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"
import DoctorCard from "./(frontend)/components/DoctorCard/DoctorCards"
import { mockDoctors } from "./(frontend)/data/mockDoctors"
import Footer from "./(frontend)/components/Footer/Footer"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    AOS.init({ duration: 800, once: false })
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      // If doctor is logged in, redirect to schedule
      if (parsedUser.role === "doctor") {
        router.push("/")
      }
    }
  }, [router])

  const reviews = [
    { id: 1, name: 'Sarah K.', role: 'Patient', text: 'Quick booking and a compassionate doctor — highly recommend!', rating: 5 },
    { id: 2, name: 'Michael B.', role: 'Patient', text: 'The care I received was professional and attentive.', rating: 5 },
    { id: 3, name: 'Priya S.', role: 'Patient', text: 'Easy to use and great follow-up support from the clinic.', rating: 4 },
  ]

  return (
    <div className="w-full bg-background text-foreground">
      {/* ===== HERO SECTION ===== */}
      <section className="w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 purple-gradient-hero">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8" data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit purple-pill">
                <Stethoscope className="w-4 h-4 text-amethyst" />
                <span className="text-sm font-semibold text-amethyst">Healthcare Reimagined</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
                Your Health,{" "}
                <span className="purple-gradient-text">
                  Our Priority
                </span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Connect with trusted healthcare professionals, book appointments in seconds, and manage your health journey all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {!user || user.role !== "doctor" ? (
                  <Link
                    href="/doctor"
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all duration-300 shadow-purple hover:shadow-purple-lg"
                  >
                    Find a Doctor
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : null}
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 font-semibold rounded-lg transition-all duration-300 border-amethyst text-amethyst hover-bg-purple"
                >
                  Get Started
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-amethyst">500+</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Doctors</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-amethyst">95%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Satisfaction</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-amethyst">24/7</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Support</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative" data-aos="fade-left">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/abc.png"
                  alt="Healthcare"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating Card */}
              <div className="mt-6 bg-card border-purple-glow rounded-xl p-4 shadow-purple-lg max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg purple-icon-bg">
                    <Clock className="w-5 h-5 text-amethyst" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Instant Booking</p>
                    <p className="text-xs text-muted-foreground">Schedule in seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose MedApp?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need for better healthcare management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Stethoscope, title: "Find Doctors", desc: "Browse verified healthcare professionals" },
              { icon: Calendar, title: "Easy Booking", desc: "Schedule appointments in seconds" },
              { icon: Lock, title: "Secure Records", desc: "Your health data stays private" },
              { icon: Heart, title: "Quality Care", desc: "Trusted by thousands of patients" },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-card border-purple-glow rounded-xl p-6"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="p-3 rounded-lg w-fit mb-4 purple-pill">
                  <feature.icon className="w-6 h-6 text-amethyst" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 purple-gradient-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive healthcare solutions for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Emergency Care", desc: "24/7 immediate medical assistance", icon: "🚨" },
              { title: "Cardiology", desc: "Heart and cardiovascular health services", icon: "❤️" },
              { title: "Primary Care", desc: "Preventive and ongoing health management", icon: "👨‍⚕️" },
            ].map((service, i) => (
              <div
                key={i}
                className="bg-card border-purple-glow rounded-xl p-8 shadow-purple"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <p className="text-5xl mb-4">{service.icon}</p>
                <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DOCTORS PREVIEW (Only for non-doctors) ===== */}
      {!user || user.role !== "doctor" ? (
        <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12" data-aos="fade-up">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">Meet Our Experts</h2>
                <p className="text-muted-foreground">Skilled professionals ready to help</p>
              </div>
              <Link
                href="/doctor"
                className="mt-4 sm:mt-0 inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all text-amethyst"
              >
                View All Doctors
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDoctors.slice(0, 6).map((doctor: any, i: number) => (
                <div key={doctor.id} data-aos="fade-up" data-aos-delay={i * 100}>
                  <DoctorCard doctor={doctor} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ===== REVIEWS / TESTIMONIALS ===== */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 purple-gradient-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Patients Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Real feedback from people we've helped</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <div key={r.id} className="bg-card border-purple-glow rounded-xl p-6 shadow-purple" data-aos="fade-up" data-aos-delay={i * 80}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                  <div className="text-amethyst font-bold">{Array.from({ length: r.rating }).map(() => '★').join('')}{Array.from({ length: 5 - r.rating }).map(() => '☆').join('')}</div>
                </div>
                <p className="text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto" data-aos="fade-up">
          <div className="purple-gradient-bg border-purple-glow rounded-2xl p-8 sm:p-12 text-center shadow-purple">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust MedApp for their healthcare needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-all"
              >
                Create Your Account
              </Link>
              {!user || user.role !== "doctor" ? (
                <Link
                  href="/doctor"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 font-semibold rounded-lg transition-all border-amethyst text-amethyst hover-bg-purple"
                >
                  Browse Doctors
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ===== DEMO CREDENTIALS ===== */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 sm:p-8 bg-card border-purple-glow rounded-xl shadow-purple" data-aos="fade-up">
            <p className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amethyst" />
              Demo Credentials for Testing
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Patient Account:</p>
                <p className="font-mono text-foreground">patient@demo.com / password</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Doctor Account:</p>
                <p className="font-mono text-foreground">doctor@demo.com / password</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  )
}
