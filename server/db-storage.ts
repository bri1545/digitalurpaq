import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { eq, and, lte, gt } from "drizzle-orm";
import {
  clubs,
  registrations,
  reminders,
  quizResponses,
  type Club,
  type InsertClub,
  type Registration,
  type InsertRegistration,
  type Reminder,
  type InsertReminder,
  type QuizResponse,
  type InsertQuizResponse,
} from "@shared/schema";
import type { IStorage } from "./storage";

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

export class DbStorage implements IStorage {
  // Clubs
  async getAllClubs(): Promise<Club[]> {
    return await db.select().from(clubs);
  }

  async getClubById(id: string): Promise<Club | undefined> {
    const result = await db.select().from(clubs).where(eq(clubs.id, id));
    return result[0];
  }

  async createClub(insertClub: InsertClub): Promise<Club> {
    const result = await db.insert(clubs).values(insertClub).returning();
    return result[0];
  }

  async updateClubEnrollment(clubId: string, delta: number): Promise<void> {
    const club = await this.getClubById(clubId);
    if (club) {
      await db
        .update(clubs)
        .set({ currentEnrollment: club.currentEnrollment + delta })
        .where(eq(clubs.id, clubId));
    }
  }

  // Registrations
  async getAllRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations);
  }

  async getRegistrationById(id: string): Promise<Registration | undefined> {
    const result = await db
      .select()
      .from(registrations)
      .where(eq(registrations.id, id));
    return result[0];
  }

  async getRegistrationsByClubId(clubId: string): Promise<Registration[]> {
    return await db
      .select()
      .from(registrations)
      .where(eq(registrations.clubId, clubId));
  }

  async createRegistration(
    insertRegistration: InsertRegistration
  ): Promise<Registration> {
    const result = await db
      .insert(registrations)
      .values(insertRegistration)
      .returning();

    // Update club enrollment
    await this.updateClubEnrollment(insertRegistration.clubId, 1);

    return result[0];
  }

  async updateRegistrationStatus(id: string, status: string): Promise<void> {
    const registration = await this.getRegistrationById(id);
    if (registration) {
      const oldStatus = registration.status;
      await db
        .update(registrations)
        .set({ status })
        .where(eq(registrations.id, id));

      // Update club enrollment if status changes to/from active
      if (oldStatus === "active" && status !== "active") {
        await this.updateClubEnrollment(registration.clubId, -1);
      } else if (oldStatus !== "active" && status === "active") {
        await this.updateClubEnrollment(registration.clubId, 1);
      }
    }
  }

  // Reminders
  async createReminder(insertReminder: InsertReminder): Promise<Reminder> {
    const result = await db
      .insert(reminders)
      .values(insertReminder)
      .returning();
    return result[0];
  }

  async getPendingReminders(): Promise<Reminder[]> {
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    return await db
      .select()
      .from(reminders)
      .where(
        and(
          eq(reminders.reminderSent, false),
          lte(reminders.activityDate, thirtyMinutesFromNow),
          gt(reminders.activityDate, now)
        )
      );
  }

  async markReminderSent(id: string): Promise<void> {
    await db
      .update(reminders)
      .set({ reminderSent: true })
      .where(eq(reminders.id, id));
  }

  // Quiz Responses
  async createQuizResponse(
    insertQuizResponse: InsertQuizResponse
  ): Promise<QuizResponse> {
    const result = await db
      .insert(quizResponses)
      .values(insertQuizResponse)
      .returning();
    return result[0];
  }

  async getQuizResponseBySessionId(
    sessionId: string
  ): Promise<QuizResponse | undefined> {
    const result = await db
      .select()
      .from(quizResponses)
      .where(eq(quizResponses.sessionId, sessionId));
    return result[0];
  }
}
