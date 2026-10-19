import { ClassroomService } from './src/services/classroom.service.js';

async function test() {
  const service = new ClassroomService();
  await service.initialize();
  if (service.isAuthenticated) {
    console.log("Fetching courses...");
    const courses = await service.getCourses();
    console.log(`Found ${courses.length} courses:`);
    for (const c of courses) {
      console.log(`- ${c.name} (${c.id})`);
    }
  } else {
    console.log("Not authenticated.");
  }
}

test();
