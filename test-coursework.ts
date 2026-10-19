import { ClassroomService } from './src/services/classroom.service.js';

async function test() {
  const service = new ClassroomService();
  await service.initialize();
  if (service.isAuthenticated) {
    console.log("Fetching courses...");
    const courses = await service.getCourses();
    console.log(`Found ${courses.length} courses`);
    let totalAssignments = 0;

    // Only query first 3 courses to see how it looks
    for (const c of courses.slice(0, 3)) {
        console.log(`Fetching coursework for: ${c.name}`);
        const work = await service.getPendingCourseWork(c.id!);
        console.log(`Found ${work.length} assignments`);
        if (work.length > 0) {
            console.log(work[0]); // Look at one
        }
        totalAssignments += work.length;
    }
  } else {
    console.log("Not authenticated.");
  }
}

test();
