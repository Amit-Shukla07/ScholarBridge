import { AttendanceService } from './src/services/attendance.service.js';

async function test() {
  const service = new AttendanceService();
  const res = await service.getCourseAttendance('CSE302');
  console.log("Service Result:", JSON.stringify(res, null, 2));
}
test();
