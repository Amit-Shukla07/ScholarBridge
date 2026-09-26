import { CalendarService } from './src/services/calendar.service.js';

async function main() {
  const service = new CalendarService();
  await service.initialize();

  if (service.isAuthenticated) {
    console.log("✅ Already authenticated! token.json exists.");
    process.exit(0);
  }

  const codeArg = process.argv[2];

  if (!codeArg) {
    const authUrl = service.getAuthUrl();
    console.log("\n=============================================");
    console.log("URL_TO_CLICK");
    console.log(authUrl);
    console.log("=============================================\n");
  } else {
    try {
      console.log("\nGenerating token...");
      await service.authorize(decodeURIComponent(codeArg));
      console.log("✅ Success! token.json has been created and you are fully authenticated!");
    } catch (e: any) {
      console.error("❌ Failed to authenticate. Did you copy the code correctly?", e.message);
    }
  }
}

main().catch(console.error);
