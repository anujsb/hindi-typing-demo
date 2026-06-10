import { timestamp, pgTable, text, primaryKey, integer, varchar, pgEnum, boolean, real } from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

export const languageEnum = pgEnum("language", ["ENGLISH", "HINDI", "MANGAL"]);
export const layoutEnum = pgEnum("layout", ["KURTIDEV_010", "RAMINTON_GAIL", "INSCRIPT", "RAMINTON_GAIL_CBI", "NONE"]);

export const subscriptionStatusEnum = pgEnum("subscription_status", ["TRIAL", "PREMIUM"]);
export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("passwordHash"),
  mobileNumber: varchar("mobileNumber", { length: 20 }),
  district: varchar("district", { length: 255 }),
  state: varchar("state", { length: 255 }),
  role: roleEnum("role").default("USER").notNull(),
  subscriptionStatus: subscriptionStatusEnum("subscriptionStatus").default("TRIAL"),
  subscriptionEndDate: timestamp("subscriptionEndDate", { mode: "date" }),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)

export const exercises = pgTable("exercise", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  srNameDate: varchar("sr_name_date", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  language: languageEnum("language").notNull(),
  layout: layoutEnum("layout").notNull(),
  content: text("content").notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  orderIndex: integer("order_index").notNull(),
});

export const userExerciseProgress = pgTable("user_exercise_progress", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id").notNull().references(() => exercises.id, { onDelete: "cascade" }),
  wpm: real("wpm").notNull(),
  accuracy: real("accuracy").notNull(),
  timeTaken: integer("time_taken").notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }).defaultNow(),
});

export const videoTutorials = pgTable("video_tutorial", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  day: integer("day").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  practiceTestContent: text("practice_test_content"),
  language: languageEnum("language").notNull(),
  layout: layoutEnum("layout").notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
});

export const userVideoProgress = pgTable("user_video_progress", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  videoId: text("video_id").notNull().references(() => videoTutorials.id, { onDelete: "cascade" }),
  completed: boolean("completed").default(false).notNull(),
  unlockedAt: timestamp("unlocked_at", { mode: "date" }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.videoId] })
}));
