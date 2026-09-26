import { google, calendar_v3, Auth } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../token.json');

export class CalendarService {
  private calendar: calendar_v3.Calendar;
  private oAuth2Client: Auth.OAuth2Client;
  public isAuthenticated: boolean = false;

  constructor() {
    this.oAuth2Client = new google.auth.OAuth2();
    this.calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });
  }

  /**
   * Initializes the Google Calendar API by loading credentials and tokens.
   */
  async initialize(): Promise<void> {
    try {
      const content = await fs.readFile(CREDENTIALS_PATH, 'utf-8');
      const credentials = JSON.parse(content);
      const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
      const redirectUri = (redirect_uris && redirect_uris.length > 0) ? redirect_uris[0] : 'http://localhost';
      
      this.oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirectUri
      );
      this.calendar = google.calendar({ version: 'v3', auth: this.oAuth2Client });

      try {
        const tokenContent = await fs.readFile(TOKEN_PATH, 'utf-8');
        this.oAuth2Client.setCredentials(JSON.parse(tokenContent));
        this.isAuthenticated = true;
      } catch (err) {
        console.error("Token not found. You must run the authorization flow.");
        this.isAuthenticated = false;
      }
    } catch (err) {
      console.error("credentials.json not found. Please create it in the project root.", err);
    }
  }

  /**
   * Generates the URL the user needs to visit to authorize the application.
   */
  getAuthUrl(): string {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
    });
  }

  /**
   * Completes the OAuth flow, exchanging the auth code for a token and saving it.
   */
  async authorize(code: string): Promise<void> {
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokens);
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
    this.isAuthenticated = true;
    console.log("Token stored to", TOKEN_PATH);
  }

  /**
   * Creates an event in the user's primary calendar.
   */
  async createEvent(event: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event> {
    if (!this.isAuthenticated) throw new Error("Not authenticated to Google Calendar");
    
    // Add an extended property so we can identify and delete these later
    if (!event.extendedProperties) event.extendedProperties = { private: {} };
    if (!event.extendedProperties.private) event.extendedProperties.private = {};
    event.extendedProperties.private.source = "ScholarBridge";

    const response = await this.calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    return response.data;
  }

  /**
   * Deletes all events created by ScholarBridge to prevent duplicates.
   */
  async clearScholarBridgeEvents(): Promise<void> {
    if (!this.isAuthenticated) throw new Error("Not authenticated to Google Calendar");
    
    let pageToken: string | undefined = undefined;
    
    do {
      const response: any = await this.calendar.events.list({
        calendarId: 'primary',
        privateExtendedProperty: ['source=ScholarBridge'],
        maxResults: 250,
        pageToken: pageToken
      });
      
      const events = response.data.items || [];
      for (const event of events) {
        if (event.id) {
          try {
            await this.calendar.events.delete({
              calendarId: 'primary',
              eventId: event.id
            });
            console.log(`Deleted existing event: ${event.summary}`);
          } catch (e: any) {
            console.error(`Failed to delete event ${event.id}:`, e.message);
          }
        }
      }
      
      pageToken = response.data.nextPageToken || undefined;
    } while (pageToken);
  }
}
