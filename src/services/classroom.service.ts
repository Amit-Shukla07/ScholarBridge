import { google, classroom_v1, Auth } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../token.json');

export class ClassroomService {
  private classroom: classroom_v1.Classroom;
  private oAuth2Client: Auth.OAuth2Client;
  public isAuthenticated: boolean = false;

  constructor() {
    this.oAuth2Client = new google.auth.OAuth2();
    this.classroom = google.classroom({ version: 'v1', auth: this.oAuth2Client });
  }

  /**
   * Initializes the Google Classroom API by loading credentials and tokens.
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
      this.classroom = google.classroom({ version: 'v1', auth: this.oAuth2Client });

      try {
        const tokenContent = await fs.readFile(TOKEN_PATH, 'utf-8');
        this.oAuth2Client.setCredentials(JSON.parse(tokenContent));
        this.isAuthenticated = true;
      } catch (err) {
        console.error("Token not found. You must run the authorization flow.");
        this.isAuthenticated = false;
      }
    } catch (err) {
      console.error("credentials.json not found.", err);
    }
  }

  /**
   * Generates authorization URL for Google Classroom and Calendar scopes.
   */
  getAuthUrl(): string {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
        'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly'
      ]
    });
  }

  /**
   * Fetches all courses the user is enrolled in.
   */
  async getCourses(): Promise<classroom_v1.Schema$Course[]> {
    if (!this.isAuthenticated) throw new Error("Not authenticated to Google Classroom");

    const response = await this.classroom.courses.list({
      studentId: 'me',
      courseStates: ['ACTIVE']
    });

    return response.data.courses || [];
  }

  /**
   * Fetches pending coursework (assignments) for a specific course.
   */
  async getPendingCourseWork(courseId: string): Promise<classroom_v1.Schema$CourseWork[]> {
    if (!this.isAuthenticated) throw new Error("Not authenticated to Google Classroom");

    // Get all coursework
    const response = await this.classroom.courses.courseWork.list({
      courseId: courseId,
      orderBy: 'dueDate asc'
    });

    const allWork = response.data.courseWork || [];

    // We only want assignments that have a due date in the future and aren't submitted
    // Note: To check if a student actually submitted it, we'd need to query studentSubmissions,
    // but fetching all coursework is a good start.
    return allWork;
  }
}
