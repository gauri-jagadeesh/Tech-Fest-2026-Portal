import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

dotenv.config();

const sampleEvents = [
  {
    title: 'HackNova 2026: 36-Hour National Hackathon',
    category: 'Hackathon',
    description: 'The flagship national hackathon of Tech-Fest 2026. Join over 500 developers, designers, and innovators to build cutting-edge solutions addressing AI, Climate Tech, FinTech, and Decentralized Systems. 36 hours of non-stop coding, mentorship from industry titans, free food, and massive rewards.',
    shortDescription: 'Build next-gen solutions in 36 hours with mentorship from top engineers.',
    date: 'March 14-16, 2026',
    time: '09:00 AM (Starts) - 06:00 PM (Ends)',
    venue: 'Convention Center & Innovation Arena, Hall A',
    teamSize: '2 - 4 Members',
    prizePool: '₹1,50,000',
    registrationFee: 'Free',
    capacity: 120,
    registeredCount: 0,
    rules: [
      'Teams must consist of 2 to 4 members with valid college IDs.',
      'All code must be written during the 36-hour hackathon window.',
      'Open-source libraries and APIs are permitted; pre-built full apps are disqualified.',
      'Final submissions require a working GitHub repository and 3-minute video pitch.',
    ],
    coordinator: {
      name: 'Aryan Sharma',
      phone: '+91 98765 11001',
      email: 'hacknova@techfest2026.com',
    },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'Open',
    tags: ['Hackathon', 'AI', 'Fintech', 'Web3', 'Overnight'],
  },
  {
    title: 'CodeSprint Extreme: Algorithmic Duel',
    category: 'Coding',
    description: 'A high-octane speed programming battle. Test your mastery of Data Structures, Dynamic Programming, Graph Theory, and Competitive Mathematics. 3 rounds of escalating difficulty with live real-time scoreboards.',
    shortDescription: 'Solve complex algorithmic challenges against top coders under tight time limits.',
    date: 'March 15, 2026',
    time: '11:00 AM - 02:00 PM',
    venue: 'Turing Computer Science Laboratory, Block C',
    teamSize: 'Individual (1 Member)',
    prizePool: '₹50,000',
    registrationFee: 'Free',
    capacity: 150,
    registeredCount: 0,
    rules: [
      'Individual participation only.',
      'Supported languages: C++, Java, Python, Rust.',
      'Plagiarism checks are automatically executed post-round.',
      'Ties will be broken by submission timestamp and penalty minutes.',
    ],
    coordinator: {
      name: 'Pooja Nair',
      phone: '+91 98765 22002',
      email: 'codesprint@techfest2026.com',
    },
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'Open',
    tags: ['Algorithms', 'DSA', 'Competitive Coding', 'Speed'],
  },
  {
    title: 'RoboWars 2026: Mecha Clash Arena',
    category: 'Robotics',
    description: 'The most ferocious mechanical combat of the year. Build a bot in the 15kg or 30kg combat category and battle in an enclosed bulletproof steel arena. Weaponry allowed: spinning drums, pneumatic flippers, and wedge lifters.',
    shortDescription: 'Witness heavy metal warfare in our fortified combat arena.',
    date: 'March 16, 2026',
    time: '01:00 PM - 06:00 PM',
    venue: 'Outdoor Sports Pavilion Arena',
    teamSize: '2 - 5 Members',
    prizePool: '₹80,000',
    registrationFee: 'Free',
    capacity: 40,
    registeredCount: 0,
    rules: [
      'Robot weight must not exceed the category limit (+2% tolerance).',
      'Failsafe power cut-off switch must be accessible externally.',
      'No liquid, flame, or radio jamming weapons permitted.',
      'Matches last 3 minutes or until one robot is immobilized for 10 seconds.',
    ],
    coordinator: {
      name: 'Karan Verma',
      phone: '+91 98765 33003',
      email: 'robowars@techfest2026.com',
    },
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    status: 'Open',
    tags: ['Robotics', 'Hardware', 'Combat', 'Mechatronics'],
  },
  {
    title: 'NeuralCon: GenAI & LLM Innovation Summit',
    category: 'AI & Data',
    description: 'An applied AI competition where participants architect autonomous AI agents, multi-modal vision pipelines, and fine-tuned domain LLMs to tackle real enterprise problems.',
    shortDescription: 'Design autonomous AI agents and fine-tuned LLM architectures.',
    date: 'March 15, 2026',
    time: '10:00 AM - 04:30 PM',
    venue: 'Auditorium 2, Media Center',
    teamSize: '1 - 3 Members',
    prizePool: '₹60,000',
    registrationFee: 'Free',
    capacity: 80,
    registeredCount: 0,
    rules: [
      'Models must be runnable locally or via designated cloud API credits.',
      'Teams must submit architecture benchmarks and latency metrics.',
      'Interactive live demos will be judged by senior AI researchers.',
    ],
    coordinator: {
      name: 'Dr. Sameer Sen',
      phone: '+91 98765 44004',
      email: 'neuralcon@techfest2026.com',
    },
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    status: 'Open',
    tags: ['AI', 'LLM', 'Machine Learning', 'Data Science'],
  },
  {
    title: 'Valorant Titan Series: Inter-College Esports',
    category: 'Gaming',
    description: 'Lock in your agents! The premier tactical shooter tournament of Tech-Fest 2026. Double elimination bracket featuring Mumbai, Pune, Delhi, and Bangalore collegiate teams.',
    shortDescription: 'Double elimination 5v5 tactical shooter championship on LAN.',
    date: 'March 14-15, 2026',
    time: '02:00 PM - 09:00 PM',
    venue: 'Esports Gaming Lounge, Student Center',
    teamSize: '5 Members + 1 Sub',
    prizePool: '₹40,000',
    registrationFee: 'Free',
    capacity: 32,
    registeredCount: 0,
    rules: [
      '5v5 standard competitive custom match settings.',
      'Tournament maps: Ascent, Bind, Haven, Sunset, Lotus.',
      'Strict anti-cheat protocols and referee oversight.',
    ],
    coordinator: {
      name: 'Rohan Deshmukh',
      phone: '+91 98765 55005',
      email: 'esports@techfest2026.com',
    },
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    status: 'Open',
    tags: ['Gaming', 'Esports', 'LAN', 'Tactical'],
  },
  {
    title: 'CyberShield: 24-Hour Capture The Flag (CTF)',
    category: 'Coding',
    description: 'Delve into binary exploitation, reverse engineering, web vulnerabilities, cryptography, and digital forensics. Discover hidden flags and conquer the leaderboard.',
    shortDescription: 'Jeopardy-style offensive and defensive cybersecurity challenges.',
    date: 'March 15, 2026',
    time: '12:00 PM - 12:00 PM (24h)',
    venue: 'Cyber Security Lab & Virtual Arena',
    teamSize: '1 - 3 Members',
    prizePool: '₹45,000',
    registrationFee: 'Free',
    capacity: 100,
    registeredCount: 0,
    rules: [
      'Jeopardy-style scoring with dynamic flag degradation.',
      'Attacking the tournament infrastructure will lead to immediate disqualification.',
      'Sharing flags or solutions between teams is strictly prohibited.',
    ],
    coordinator: {
      name: 'Neha Kulkarni',
      phone: '+91 98765 66006',
      email: 'cybershield@techfest2026.com',
    },
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    status: 'Open',
    tags: ['Cybersecurity', 'CTF', 'Cryptography', 'Reverse Engineering'],
  },
  {
    title: 'InnovateX: National Technical Paper Presentation',
    category: 'Paper Presentation',
    description: 'Present original research in Sustainable Computing, Edge Computing, Quantum Algorithms, and Biomedical Engineering to IEEE fellows and academia judges.',
    shortDescription: 'Present published or original undergraduate and postgraduate research.',
    date: 'March 16, 2026',
    time: '10:00 AM - 03:00 PM',
    venue: 'Seminar Hall 1, Academic Complex',
    teamSize: '1 - 2 Authors',
    prizePool: '₹35,000',
    registrationFee: 'Free',
    capacity: 50,
    registeredCount: 0,
    rules: [
      'Standard IEEE paper formatting is mandatory.',
      'Maximum 10-minute presentation followed by 5 minutes of Q&A.',
      'Plagiarism score must be below 15%.',
    ],
    coordinator: {
      name: 'Prof. Anjali Mehta',
      phone: '+91 98765 77007',
      email: 'innovatex@techfest2026.com',
    },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    status: 'Open',
    tags: ['Research', 'IEEE', 'Paper', 'Innovation'],
  },
  {
    title: 'CloudOps & Kubernetes Masterclass Workshop',
    category: 'Workshop',
    description: 'Hands-on intensive bootcamp exploring Docker containers, Kubernetes clusters, CI/CD pipelines, and cloud native scaling on modern infrastructure.',
    shortDescription: 'Master modern DevOps, containers, and Kubernetes with industry leaders.',
    date: 'March 14, 2026',
    time: '01:00 PM - 05:30 PM',
    venue: 'Cloud Computing Lab, 3rd Floor',
    teamSize: 'Individual',
    prizePool: 'Certificates & Cloud Credits',
    registrationFee: 'Free',
    capacity: 75,
    registeredCount: 0,
    rules: [
      'Laptops with minimum 8GB RAM and Docker Desktop pre-installed are recommended.',
      'Participants receive free $100 Cloud Platform credits and certificate of completion.',
    ],
    coordinator: {
      name: 'Vikram Joshi',
      phone: '+91 98765 88008',
      email: 'workshop@techfest2026.com',
    },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    status: 'Open',
    tags: ['DevOps', 'Kubernetes', 'Cloud', 'Workshop'],
  },
];

export const seedData = async () => {
  // Clear existing data
  await User.deleteMany({});
  await Event.deleteMany({});
  await Registration.deleteMany({});
  console.log('🧹 Cleared existing database records.');

  // Create Admin User
  const admin = await User.create({
    name: 'Festival Administrator',
    email: 'admin@techfest2026.com',
    password: 'Admin@2026',
    role: 'admin',
    college: 'Tech Fest Central Organizing Committee',
    phone: '+91 98765 00001',
  });
  console.log(`👤 Admin created: ${admin.email} (Password: Admin@2026)`);

  // Create Student User
  const student = await User.create({
    name: 'Alex Johnson',
    email: 'student@techfest2026.com',
    password: 'Student@2026',
    role: 'student',
    college: 'National Institute of Technology',
    phone: '+91 98765 00002',
  });
  console.log(`🎓 Student created: ${student.email} (Password: Student@2026)`);

  // Create Sample Events
  const createdEvents = await Event.insertMany(sampleEvents);
  console.log(`🎉 Seeded ${createdEvents.length} Tech Fest events.`);

  // Create a sample registration for the student
  const sampleEvent = createdEvents[0];
  const registration = await Registration.create({
    user: student._id,
    event: sampleEvent._id,
    teamName: 'CyberKnights',
    teamMembers: [
      { name: 'Alex Johnson', email: 'student@techfest2026.com', college: 'National Institute of Technology' },
      { name: 'Elena Rostova', email: 'elena@nit.edu', college: 'National Institute of Technology' },
    ],
    ticketCode: 'TF26-HACK-77A9',
    status: 'Confirmed',
    notes: 'Hardware lab access requested',
  });

  sampleEvent.registeredCount = 1;
  await sampleEvent.save();
  console.log(`🎟️ Created sample registration with Ticket Code: ${registration.ticketCode}`);

  return { admin, student, createdEvents, registration };
};

const runCliSeed = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri === 'your_mongodb_atlas_connection_string') {
    console.error('❌ Cannot run seed: MONGO_URI is missing or not configured in server/.env');
    console.log('👉 Please set MONGO_URI=mongodb+srv://... in server/.env before seeding.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ Connected to MongoDB Atlas: ${mongoose.connection.host}`);
    await seedData();
    console.log('\n✨ Database seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    if (error.message.includes('Authentication failed') || error.message.includes('bad auth')) {
      console.error('\n⚠️  MongoDB Atlas Authentication Failed:');
      console.error('   The Database User or Password in server/.env does not match Atlas.');
      console.error('   1. Log into https://cloud.mongodb.com');
      console.error('   2. Navigate to Security -> Database Access');
      console.error('   3. Verify user name exists or click "Add New Database User"');
      console.error('   4. Set password and click "Add User" (or "Update User")');
      console.error('   5. Verify Security -> Network Access has 0.0.0.0/0 (or your public IP)\n');
    }
    process.exit(1);
  }
};

// If run directly from terminal
if (import.meta.url === `file://${process.argv[1]}`) {
  runCliSeed();
}

export { sampleEvents };
