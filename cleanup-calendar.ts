import { CalendarService } from './src/services/calendar.service.js';

async function main() {
  const calendarService = new CalendarService();
  await calendarService.initialize();

  if (!calendarService.isAuthenticated) {
    console.error("Not authenticated.");
    process.exit(1);
  }

  console.log("Searching for old [Class] events to clean up duplicates...");
  let pageToken: string | undefined = undefined;
  
  do {
    const response: any = await calendarService['calendar'].events.list({
      calendarId: 'primary',
      q: '[Class]', // Search for the prefix
      maxResults: 250,
      pageToken: pageToken
    });
    
    const events = response.data.items || [];
    for (const event of events) {
      if (event.id && event.summary?.includes('[Class]')) {
        try {
          await calendarService['calendar'].events.delete({
            calendarId: 'primary',
            eventId: event.id
          });
          console.log(`Deleted: ${event.summary}`);
        } catch (e: any) {
          console.error(`Failed to delete event ${event.id}:`, e.message);
        }
      }
    }
    pageToken = response.data.nextPageToken || undefined;
  } while (pageToken);
  
  console.log("Cleanup complete! Now you can sync cleanly.");
}

main().catch(console.error);
