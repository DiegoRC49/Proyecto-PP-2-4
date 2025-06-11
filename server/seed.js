import mongoose from 'mongoose';
import Game from './models/Game.js';

const MONGODB_URI = 'mongodb://localhost:27017/gaming-marketplace';

const sampleGames = [
  {
    title: "Cyberpunk 2077",
    description: "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
    price: 59.99,
    originalPrice: 69.99,
    discount: 15,
    category: "RPG",
    platform: ["PC", "PlayStation 5", "Xbox Series X"],
    genre: ["Action", "RPG", "Open World"],
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseDate: new Date("2020-12-10"),
    images: [
      { url: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800", type: "cover" },
      { url: "https://images.pexels.com/photos/7915016/pexels-photo-7915016.jpeg?auto=compress&cs=tinysrgb&w=800", type: "screenshot" }
    ],
    rating: { average: 4.2, count: 1250 },
    tags: ["Futuristic", "Open World", "Story Rich"],
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i5-3570K or AMD FX-8310",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 780 or AMD Radeon RX 470",
        storage: "70 GB available space"
      },
      recommended: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i7-4790 or AMD Ryzen 3 3200G",
        memory: "12 GB RAM",
        graphics: "NVIDIA GeForce GTX 1060 6GB or AMD Radeon R9 Fury",
        storage: "70 GB SSD space"
      }
    },
    featured: true,
    salesCount: 850
  },
  {
    title: "The Witcher 3: Wild Hunt",
    description: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will.",
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    category: "RPG",
    platform: ["PC", "PlayStation 5", "Xbox Series X", "Nintendo Switch"],
    genre: ["RPG", "Open World", "Fantasy"],
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    releaseDate: new Date("2015-05-19"),
    images: [
      { url: "https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=800", type: "cover" },
      { url: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800", type: "screenshot" }
    ],
    rating: { average: 4.8, count: 2150 },
    tags: ["Fantasy", "Open World", "Story Rich", "Medieval"],
    systemRequirements: {
      minimum: {
        os: "Windows 7 64-bit",
        processor: "Intel CPU Core i5-2500K 3.3GHz / AMD CPU Phenom II X4 940",
        memory: "6 GB RAM",
        graphics: "Nvidia GPU GeForce GTX 660 / AMD GPU Radeon HD 7870",
        storage: "35 GB available space"
      },
      recommended: {
        os: "Windows 10 64-bit",
        processor: "Intel CPU Core i7 3770 3.4 GHz / AMD CPU AMD FX-8350 4 GHz",
        memory: "8 GB RAM",
        graphics: "Nvidia GPU GeForce GTX 770 / AMD GPU Radeon R9 290",
        storage: "35 GB available space"
      }
    },
    featured: true,
    salesCount: 1520
  },
  {
    title: "Elden Ring",
    description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    price: 59.99,
    category: "Action",
    platform: ["PC", "PlayStation 5", "Xbox Series X"],
    genre: ["Action", "RPG", "Dark Fantasy"],
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    releaseDate: new Date("2022-02-25"),
    images: [
      { url: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800", type: "cover" },
      { url: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800", type: "screenshot" }
    ],
    rating: { average: 4.6, count: 980 },
    tags: ["Souls-like", "Dark Fantasy", "Challenging", "Open World"],
    systemRequirements: {
      minimum: {
        os: "Windows 10",
        processor: "Intel Core i5-8400 / AMD RYZEN 3 3300X",
        memory: "12 GB RAM",
        graphics: "NVIDIA GeForce GTX 1060 3GB / AMD Radeon RX 580 4GB",
        storage: "60 GB available space"
      },
      recommended: {
        os: "Windows 10/11",
        processor: "Intel Core i7-8700K / AMD RYZEN 5 3600X",
        memory: "16 GB RAM",
        graphics: "NVIDIA GeForce GTX 1070 8GB / AMD Radeon RX Vega 56 8GB",
        storage: "60 GB available space"
      }
    },
    featured: true,
    salesCount: 1120
  },
  {
    title: "FIFA 24",
    description: "EA SPORTS FC 24 welcomes you to The World's Game: the most true-to-football experience ever with HyperMotionV technology.",
    price: 69.99,
    category: "Sports",
    platform: ["PC", "PlayStation 5", "Xbox Series X", "Nintendo Switch"],
    genre: ["Sports", "Simulation", "Multiplayer"],
    developer: "EA Vancouver",
    publisher: "Electronic Arts",
    releaseDate: new Date("2023-09-29"),
    images: [
      { url: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=800", type: "cover" },
      { url: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800", type: "screenshot" }
    ],
    rating: { average: 4.1, count: 750 },
    tags: ["Football", "Sports", "Multiplayer", "Realistic"],
    systemRequirements: {
      minimum: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i5 6600k or AMD Ryzen 5 1600",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 1050 Ti or AMD Radeon RX 570",
        storage: "100 GB available space"
      },
      recommended: {
        os: "Windows 10 64-bit",
        processor: "Intel Core i7 6700 or AMD Ryzen 7 2700X",
        memory: "12 GB RAM",
        graphics: "NVIDIA GeForce GTX 1660 or AMD Radeon RX 5600 XT",
        storage: "100 GB available space"
      }
    },
    featured: false,
    salesCount: 650
  },
  {
    title: "Hades",
    description: "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler.",
    price: 24.99,
    originalPrice: 29.99,
    discount: 17,
    category: "Indie",
    platform: ["PC", "PlayStation 5", "Xbox Series X", "Nintendo Switch"],
    genre: ["Action", "Rogue-like", "Indie"],
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    releaseDate: new Date("2020-09-17"),
    images: [
      { url: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800", type: "cover" },
      { url: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800", type: "screenshot" }
    ],
    rating: { average: 4.7, count: 1850 },
    tags: ["Rogue-like", "Greek Mythology", "Indie", "Story Rich"],
    systemRequirements: {
      minimum: {
        os: "Windows 7 SP1",
        processor: "Dual Core 2.4 GHz",
        memory: "4 GB RAM",
        graphics: "1GB VRAM / DirectX 10+ support",
        storage: "15 GB available space"
      },
      recommended: {
        os: "Windows 10",
        processor: "Dual Core 3.0 GHz+",
        memory: "8 GB RAM",
        graphics: "2GB VRAM / DirectX 10+ support",
        storage: "15 GB available space"
      }
    },
    featured: true,
    salesCount: 920
  },
  {
    title: "Grand Theft Auto V",
    description: "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld.",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    category: "Action",
    platform: ["PC", "PlayStation 5", "Xbox Series X"],
    genre: ["Action", "Open World", "Crime"],
    developer: "Rockstar North",
    publisher: "Rockstar Games",
    releaseDate: new Date("2013-09-17"),
    images: [
      { url: "https://images.pexels.com/photos/371924/pexels-photo-371924.jpeg?auto=compress&cs=tinysrgb&w=800", type: "cover" },
      { url: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800", type: "screenshot" }
    ],
    rating: { average: 4.5, count: 3200 },
    tags: ["Open World", "Crime", "Multiplayer", "Mature"],
    systemRequirements: {
      minimum: {
        os: "Windows 10 64 Bit, Windows 8.1 64 Bit, Windows 8 64 Bit, Windows 7 64 Bit Service Pack 1",
        processor: "Intel Core 2 Quad CPU Q6600 @ 2.40GHz (4 CPUs) / AMD Phenom 9850 Quad-Core Processor (4 CPUs) @ 2.5GHz",
        memory: "4 GB RAM",
        graphics: "NVIDIA 9800 GT 1GB / AMD HD 4870 1GB (DX 10, 10.1, 11)",
        storage: "72 GB available space"
      },
      recommended: {
        os: "Windows 10 64 Bit, Windows 8.1 64 Bit, Windows 8 64 Bit, Windows 7 64 Bit Service Pack 1",
        processor: "Intel Core i5 3470 @ 3.2GHz (4 CPUs) / AMD X8 FX-8350 @ 4GHz (8 CPUs)",
        memory: "8 GB RAM",
        graphics: "NVIDIA GTX 660 2GB / AMD HD 7870 2GB",
        storage: "72 GB available space"
      }
    },
    featured: false,
    salesCount: 2100
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing games
    await Game.deleteMany({});
    console.log('Cleared existing games');

    // Insert sample games
    await Game.insertMany(sampleGames);
    console.log('Sample games inserted successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();