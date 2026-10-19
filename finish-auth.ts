import { CalendarService } from './src/services/calendar.service.js';
import fs from 'fs/promises';

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Please provide the code or redirect URL");
    process.exit(1);
  }

  let code = arg.trim();
  if (code.startsWith("http")) {
    try {
      const u = new URL(code);
      const extracted = u.searchParams.get("code");
      if (extracted) code = extracted;
    } catch (err) {}
  }

  const calendarService = new CalendarService();
  await calendarService.initialize();

  try {
    const { tokens } = await calendarService['oAuth2Client'].getToken(decodeURIComponent(code));
    await fs.writeFile('token.json', JSON.stringify(tokens, null, 2));
    console.log("Token successfully stored in token.json!");
  } catch (e: any) {
    console.error("Error exchanging token:", e.message);
  }
}

main();
