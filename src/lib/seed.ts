import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to seed database');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle({ client: sql, schema });

async function main() {
  console.log("Seeding started...");

  // Example Exercises
  await db.insert(schema.exercises).values([
    {
      srNameDate: "001_Home_Row_Basic_290526",
      title: "Home Row Basic",
      language: "ENGLISH",
      layout: "KURTIDEV_010", // English typing layout falls back to default, keeping enum valid
      content: "asdfg hjkl; asdfg hjkl;",
      isPremium: false,
      orderIndex: 1,
    },
    {
      srNameDate: "002_Upper_Row_Basic_290526",
      title: "Upper Row Basic",
      language: "HINDI",
      layout: "KURTIDEV_010",
      content: "क ख ग घ ङ",
      isPremium: false,
      orderIndex: 2,
    },
    {
      srNameDate: "003_Premium_Test_290526",
      title: "Advanced Premium Test",
      language: "HINDI",
      layout: "KURTIDEV_010",
      content: "सारे जहाँ से अच्छा हिन्दोस्ताँ हमारा",
      isPremium: true,
      orderIndex: 3,
    }
  ]).onConflictDoNothing(); // Prevent crash on re-seed

  // Example Videos
  await db.insert(schema.videoTutorials).values([
    {
      day: 1,
      title: "Introduction to Home Row",
      description: "Learn the basics of the home row for Hindi typing.",
      videoUrl: "https://www.youtube.com/watch?v=dummy",
      language: "HINDI",
      layout: "KURTIDEV_010",
      isPremium: false,
    },
    {
      day: 4,
      title: "Advanced Paragraphs",
      description: "Learn to type advanced paragraphs. Subscription required.",
      videoUrl: "https://www.youtube.com/watch?v=dummy2",
      language: "HINDI",
      layout: "KURTIDEV_010",
      isPremium: true,
    }
  ]).onConflictDoNothing();

  console.log("Seeding completed successfully.");
}

main().catch(console.error);
