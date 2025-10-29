import { DbStorage } from "./db-storage";
import type { InsertClub } from "@shared/schema";

const storage = new DbStorage();

const sampleClubs: InsertClub[] = [
  {
    name: "Robotics & LEGO Construction",
    nameKz: "Робототехника және LEGO құрастыру",
    nameRu: "Робототехника и LEGO-конструирование",
    description: "Build and program robots using LEGO, learn engineering and coding",
    descriptionKz: "LEGO арқылы роботтар құрастыру және бағдарламалау, инженерия мен кодтауды үйрену",
    descriptionRu: "Собирайте и программируйте роботов с помощью LEGO, изучайте инженерию и программирование",
    category: "technology",
    ageGroup: "7-18",
    skillLevel: "beginner",
    schedule: JSON.stringify([
      { day: "Monday", time: "15:00", duration: 90 },
      { day: "Thursday", time: "15:00", duration: 90 },
    ]),
    maxCapacity: 15,
    location: "IT Лаборатория 1",
    imageUrl: null,
  },
  {
    name: "3D Prototyping & Modeling",
    nameKz: "3D прототиптеу және модельдеу",
    nameRu: "3D-прототипирование и моделирование",
    description: "Create 3D models and prototypes, learn 3D printing technology",
    descriptionKz: "3D модельдер мен прототиптер жасау, 3D басып шығару технологиясын үйрену",
    descriptionRu: "Создавайте 3D модели и прототипы, изучайте технологию 3D печати",
    category: "technology",
    ageGroup: "11-18",
    skillLevel: "intermediate",
    schedule: JSON.stringify([
      { day: "Tuesday", time: "16:00", duration: 90 },
      { day: "Friday", time: "16:00", duration: 90 },
    ]),
    maxCapacity: 12,
    location: "Кабинет 3D-прототипирования",
    imageUrl: null,
  },
  {
    name: "Programming & Web Development",
    nameKz: "Бағдарламалау және веб-әзірлеу",
    nameRu: "Программирование и веб-разработка",
    description: "Learn programming fundamentals, web development, and design",
    descriptionKz: "Бағдарламалаудың негіздерін, веб-әзірлеуді және дизайнды үйрену",
    descriptionRu: "Изучайте основы программирования, веб-разработки и дизайна",
    category: "technology",
    ageGroup: "11-18",
    skillLevel: "beginner",
    schedule: JSON.stringify([
      { day: "Wednesday", time: "15:00", duration: 90 },
      { day: "Saturday", time: "10:00", duration: 120 },
    ]),
    maxCapacity: 20,
    location: "IT Лаборатория 2",
    imageUrl: null,
  },
  {
    name: "Art School",
    nameKz: "Өнер мектебі",
    nameRu: "Художественная школа",
    description: "Fine arts, painting, drawing, and creative expression",
    descriptionKz: "Бейнелеу өнері, кескіндеме, сурет салу және шығармашылық көрініс",
    descriptionRu: "Изобразительное искусство, живопись, рисование и творческое самовыражение",
    category: "arts",
    ageGroup: "7-18",
    skillLevel: "beginner",
    schedule: JSON.stringify([
      { day: "Tuesday", time: "15:00", duration: 120 },
      { day: "Thursday", time: "15:00", duration: 120 },
      { day: "Saturday", time: "10:00", duration: 120 },
    ]),
    maxCapacity: 20,
    location: "Художественная мастерская",
    imageUrl: null,
  },
  {
    name: "Media Journalism",
    nameKz: "Медиа журналистика",
    nameRu: "Медиажурналистика",
    description: "Journalism fundamentals, media writing, and reporting",
    descriptionKz: "Журналистиканың негіздері, медиа жазу және репортаж",
    descriptionRu: "Основы журналистики, медиаписьменность и репортажи",
    category: "media",
    ageGroup: "11-18",
    skillLevel: "beginner",
    schedule: JSON.stringify([
      { day: "Tuesday", time: "16:00", duration: 90 },
      { day: "Thursday", time: "16:00", duration: 90 },
    ]),
    maxCapacity: 15,
    location: "Медиацентр",
    imageUrl: null,
  },
];

async function seed() {
  console.log("Seeding database...");
  
  const existingClubs = await storage.getAllClubs();
  
  if (existingClubs.length > 0) {
    console.log(`Database already has ${existingClubs.length} clubs. Skipping seed.`);
    return;
  }

  for (const club of sampleClubs) {
    await storage.createClub(club);
  }

  console.log(`Successfully seeded ${sampleClubs.length} clubs!`);
}

seed().catch(console.error);
