export interface Review {
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Doctor {
  id: string;
  name: string;
  email:string
  specialty: string;
  experience: string;
  image: string;
  availability: string[];
  rating: number;
  reviews: Review[];
  about: string;
}

export const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Ananya Mehta",
    specialty: "Cardiologist",
    experience: "10 years",
    image: "https://ui-avatars.com/api/?name=Ananya+Mehta&background=0D8ABC&color=fff",
    availability: ["Mon 9-11 AM", "Wed 2-4 PM", "Fri 10-12 AM"],
    rating: 4.8,
    email:"ananya@gmail.com",
    reviews: [
      {
        patientName: "Rajesh Kumar",
        rating: 5,
        comment: "Dr. Mehta is exceptional! She diagnosed my heart condition accurately and provided excellent treatment. Her bedside manner is wonderful and she explains everything clearly.",
        date: "2024-01-15"
      },
      {
        patientName: "Priya Singh",
        rating: 5,
        comment: "Very professional and caring doctor. I felt completely at ease during my consultation. Highly recommend her for cardiac care.",
        date: "2024-01-10"
      },
      {
        patientName: "Amit Patel",
        rating: 4,
        comment: "Good experience overall. The doctor was knowledgeable and the staff was helpful. Wait time was a bit long but worth it.",
        date: "2024-01-05"
      }
    ],
    about: "Dr. Ananya Mehta is a highly experienced cardiologist with over 10 years of practice. She specializes in heart diseases and has helped numerous patients recover from various cardiac conditions."
  },
  {
    id: "2",
    name: "Dr. Rohan Gupta",
    specialty: "Dermatologist",
    experience: "7 years",
    image: "https://ui-avatars.com/api/?name=Rohan+Gupta&background=2E8B57&color=fff",
    availability: ["Tue 10-1 PM", "Thu 3-6 PM"],
    rating: 4.5,
    email:"ananya@gmail.com",
    reviews: [
      {
        patientName: "Sneha Reddy",
        rating: 5,
        comment: "Dr. Gupta is amazing! He treated my acne effectively and the results were visible within weeks. Very patient and understanding.",
        date: "2024-01-12"
      },
      {
        patientName: "Vikram Sharma",
        rating: 4,
        comment: "Professional service. The treatment worked well for my skin condition. Would recommend to others.",
        date: "2024-01-08"
      }
    ],
    about: "Dr. Rohan Gupta is a skilled dermatologist with 7 years of experience in treating various skin conditions. He is committed to providing personalized care to his patients."

  },
  {
    id: "3",
    name: "Dr. Kavita Sharma",
    specialty: "Neurologist",
    experience: "12 years",
    image: "https://ui-avatars.com/api/?name=Kavita+Sharma&background=8B4513&color=fff",
    availability: ["Mon 9-12 AM", "Thu 1-4 PM"],
    rating: 4.9,
    email:"ananya@gmail.com",
    reviews: [
      {
        patientName: "Deepak Jain",
        rating: 5,
        comment: "Dr. Sharma is outstanding! She diagnosed my migraine condition accurately and provided excellent treatment options. Her expertise is remarkable.",
        date: "2024-01-14"
      },
      {
        patientName: "Meera Iyer",
        rating: 5,
        comment: "Exceptional neurologist. Very thorough in her examination and explanation. I felt confident in her treatment plan.",
        date: "2024-01-09"
      },
      {
        patientName: "Suresh Kumar",
        rating: 4,
        comment: "Good doctor with extensive knowledge. The consultation was helpful and I appreciated her detailed explanations.",
        date: "2024-01-03"
      }
    ],
    about: "Dr. Kavita Sharma is a renowned neurologist with 12 years of experience in diagnosing and treating neurological disorders. She is dedicated to providing compassionate care and staying updated with the latest advancements in neurology."

  },
  {
    id: "4",
    name: "Dr. Ananya Mehta",
    specialty: "Cardiologist",
    experience: "10 years",
    email:"ananya@gmail.com",
    image: "https://ui-avatars.com/api/?name=Ananya+Mehta&background=0D8ABC&color=fff",
    availability: ["Mon 9-11 AM", "Wed 2-4 PM", "Fri 10-12 AM"],
    rating: 4.8,
    reviews: [],
    about: "Dr. Ananya Mehta is a highly experienced cardiologist with over 10 years of practice. She specializes in heart diseases and has helped numerous patients recover from various cardiac conditions."

  },
  {
    id: "5",
    name: "Dr. Rohan Gupta",
    specialty: "Dermatologist",
    experience: "7 years",
    email:"ananya@gmail.com",
    image: "https://ui-avatars.com/api/?name=Rohan+Gupta&background=2E8B57&color=fff",
    availability: ["Tue 10-1 PM", "Thu 3-6 PM"],
    rating: 4.5,
    reviews: [],
    about: "Dr. Rohan Gupta is a skilled dermatologist with 7 years of experience in treating various skin conditions. He is committed to providing personalized care to his patients."

  },
  {
    id: "6",
    name: "Dr. Kavita Sharma",
    specialty: "Neurologist",
    experience: "12 years",
    email:"ananya@gmail.com",
    image: "https://ui-avatars.com/api/?name=Kavita+Sharma&background=8B4513&color=fff",
    availability: ["Mon 9-12 AM", "Thu 1-4 PM"],
    rating: 4.9,
    reviews: [],
    about: "Dr. Kavita Sharma is a renowned neurologist with 12 years of experience in diagnosing and treating neurological disorders. She is dedicated to providing compassionate care and staying updated with the latest advancements in neurology."

  },
  {
    id: "7",
    name: "Dr. Ananya Mehta",
    specialty: "Cardiologist",
    experience: "10 years",
    email:"ananya@gmail.com",
    image: "https://ui-avatars.com/api/?name=Ananya+Mehta&background=0D8ABC&color=fff",
    availability: ["Mon 9-11 AM", "Wed 2-4 PM", "Fri 10-12 AM"],
    rating: 4.8,
    reviews: [],
    about: "Dr. Ananya Mehta is a highly experienced cardiologist with over 10 years of practice. She specializes in heart diseases and has helped numerous patients recover from various cardiac conditions."

  },
  {
    id: "8",
    name: "Dr. Rohan Gupta",
    specialty: "Dermatologist",
    experience: "7 years",
    email:"ananya@gmail.com",
    image: "https://ui-avatars.com/api/?name=Rohan+Gupta&background=2E8B57&color=fff",
    availability: ["Tue 10-1 PM", "Thu 3-6 PM"],
    rating: 4.5,
    reviews: [],
    about: "Dr. Rohan Gupta is a skilled dermatologist with 7 years of experience in treating various skin conditions. He is committed to providing personalized care to his patients."

  },
  {
    id: "9",
    name: "Dr. Kavita Sharma",
    specialty: "Neurologist",
    email:"ananya@gmail.com",
    experience: "12 years",
    image: "https://ui-avatars.com/api/?name=Kavita+Sharma&background=8B4513&color=fff",
    availability: ["Mon 9-12 AM", "Thu 1-4 PM"],
    rating: 4.9,
    reviews: [],
    about: "Dr. Kavita Sharma is a renowned neurologist with 12 years of experience in diagnosing and treating neurological disorders. She is dedicated to providing compassionate care and staying updated with the latest advancements in neurology."

  },
]
