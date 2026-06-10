import { config } from "dotenv";
config({ path: ".env.local" });
import { db } from "../src/lib/db";
import { exercises, videoTutorials } from "../src/lib/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Deleting rows with NONE layout...");
  try {
    await db.delete(exercises).where(eq(exercises.layout, "NONE" as any));
    await db.delete(videoTutorials).where(eq(videoTutorials.layout, "NONE" as any));
    console.log("Successfully deleted NONE layouts.");
  } catch (e) {
    console.error("Error:", e);
  }
}

main();
