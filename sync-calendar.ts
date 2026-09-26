import { CalendarService } from './src/services/calendar.service.js';
import { AcademicService } from './src/services/academic.service.js';

const dayMap: Record<string, string> = {
  'Mon': 'MO', 'Tue': 'TU', 'Wed': 'WE', 'Thu': 'TH', 'Fri': 'FR', 'Sat': 'SA', 'Sun': 'SU'
};

const dayOffset: Record<string, number> = {
  'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6, 'Sun': 0
};

// Next week's start date (Monday) as the base
function getNextBaseDate(dayStr: string): Date {
  const today = new Date();
  today.setHours(0,0,0,0);
  const targetDay = dayOffset[dayStr];
  const currentDay = today.getDay();
  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) daysToAdd += 7;
  
  const targetDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return targetDate;
}

async function main() {
  const calendarService = new CalendarService();
  await calendarService.initialize();

  if (!calendarService.isAuthenticated) {
    console.error("Not authenticated. Please run setup-calendar.ts first.");
    process.exit(1);
  }

  const academicService = new AcademicService();
  const courses = academicService.getAllCourses();

  console.log("Cleaning up previous ScholarBridge calendar events...");
  await calendarService.clearScholarBridgeEvents();
  
  console.log("Syncing new timetable to Google Calendar...");

  for (const course of courses) {
    if (!course.slot) continue;
    
    // Example slot string: "Tue 15:00, Thu 13:00, Thu 14:00"
    const slots = course.slot.split(',').map(s => s.trim());
    
    for (const slot of slots) {
      const [dayStr, timeStr] = slot.split(' ');
      if (!dayStr || !timeStr) continue;
      
      const rruleDay = dayMap[dayStr];
      const baseDate = getNextBaseDate(dayStr);
      
      const [hours, minutes] = timeStr.split(':').map(Number);
      
      // Calculate start and end times (assuming 50 min class for simplicity)
      const startDate = new Date(baseDate);
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(startDate.getMinutes() + 50);

      const event = {
        summary: `[Class] ${course.code}: ${course.title}`,
        location: course.room,
        description: `Instructor: ${course.instructor}`,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'Asia/Kolkata',
        },
        recurrence: [
          `RRULE:FREQ=WEEKLY;UNTIL=20261215T000000Z;BYDAY=${rruleDay}` // Recur until Dec 15th
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      try {
        console.log(`Creating event for ${course.code} on ${dayStr} at ${timeStr}...`);
        await calendarService.createEvent(event);
      } catch (err: any) {
        console.error(`Failed to create event for ${course.code}:`, err.message);
      }
    }
  }
  
  console.log("\n🎉 Timetable fully synced to your Google Calendar!");
}

main().catch(console.error);
