import { google, Auth } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

export class GoogleService {
  private oauth2Client: Auth.OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  public getAuthUrl(): string {
    const scopes = [
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/classroom.courses.readonly"
    ];
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes
    });
  }

  public async setCredentials(code: string): Promise<void> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
  }

  public async addDeadlineEventToCalendar(title: string, dueDate: string): Promise<string> {
    // Simulated adding event
    return `Simulated adding event "${title}" on ${dueDate} to Google Calendar.`;
  }
}
