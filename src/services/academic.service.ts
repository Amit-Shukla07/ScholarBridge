import { Course, DiningMenu, AcademicDeadline } from "../types/academic.js";

const COURSE_CATALOG: Course[] = [
  { code: "CSE 302", title: "OPERATING SYSTEMS", instructor: "Dr. Nelatoori Kiran Babu, Dr. Syed Sameen Ahmad Rizvi", credits: 4, room: "(C 903), (V 604)", slot: "Tue 15:00, Thu 13:00, Thu 14:00, Fri 09:00, Fri 10:00" },
  { code: "CSE 303", title: "MACHINE LEARNING", instructor: "Dr. Ch. Anil Carie, Mr. Ajay Dilip Kumar Marapatla", credits: 4, room: "(C 903), (V 604)", slot: "Tue 09:00, Tue 10:00, Thu 11:00, Fri 15:00, Fri 16:00" },
  { code: "CSE 305", title: "COMPUTER ORGANIZATION AND ARCHITECTURE", instructor: "Dr. Anirban Bhar, Dr. Firoj Gazi", credits: 4, room: "(C 903), (V 604)", slot: "Tue 13:00, Tue 14:00, Thu 15:00, Thu 16:00, Fri 14:00" },
  { code: "CSE 309", title: "ADVANCED JAVA PROGRAMMING", instructor: "Dr. Gone Neelakantam, Dr. Paramita Das", credits: 4, room: "(C 903), (S 412)", slot: "Mon 14:00, Mon 15:00, Wed 10:00, Fri 11:00, Fri 12:00" },
  { code: "HIS 251", title: "INTRODUCTION TO GENDER", instructor: "Dr. Lekshmi Chandran CP", credits: 3, room: "(C 404)", slot: "Mon 16:00, Tue 16:00" },
  { code: "SEC 302", title: "GENERATIVE AI WITH AGENTIC AI - I", instructor: "Mr. Careerskill", credits: 2, room: "(C 903)", slot: "Mon 11:00, Mon 12:00, Wed 13:00, Wed 14:00" }
];

const DINING_MENUS: Record<string, DiningMenu> = {
  "Monday": { day: "Monday", breakfast: ["Poha", "Tea", "Fruits"], lunch: ["Rajma Chawal", "Roti", "Salad", "Curd"], snacks: ["Samosas", "Coffee"], dinner: ["Paneer Butter Masala", "Naan", "Dal Tadka", "Gulab Jamun"] },
  "Tuesday": { day: "Tuesday", breakfast: ["Idli-Sambar", "Coconut Chutney", "Filter Coffee"], lunch: ["Chole Bhature", "Lassi", "Onion Salad"], snacks: ["Pakoras", "Chai"], dinner: ["Mix Veg", "Roti", "Dal Fry", "Rice"] },
  "Wednesday": { day: "Wednesday", breakfast: ["Aloo Paratha", "Curd", "Pickle"], lunch: ["Kadhi Pakora", "Rice", "Aloo Jeera", "Roti"], snacks: ["Bread Pakora", "Tea"], dinner: ["Chicken Curry", "Shahi Paneer", "Roti", "Ice Cream"] },
  "Thursday": { day: "Thursday", breakfast: ["Upma", "Sevaiya", "Milk"], lunch: ["Dal Makhani", "Jeera Rice", "Mix Veg", "Roti"], snacks: ["Patties", "Coffee"], dinner: ["Mushroom Masala", "Roti", "Dal Tadka", "Rice"] },
  "Friday": { day: "Friday", breakfast: ["Masala Dosa", "Sambhar", "Tea"], lunch: ["Veg Biryani", "Raita", "Papad"], snacks: ["Vada Pav", "Chai"], dinner: ["Malai Kofta", "Roti", "Dal Fry", "Kheer"] },
  "Saturday": { day: "Saturday", breakfast: ["Puri Sabji", "Jalebi", "Milk"], lunch: ["Khichdi", "Kadi", "Papad", "Achar"], snacks: ["Bhel Puri", "Tea"], dinner: ["Matar Paneer", "Roti", "Dal", "Rice"] },
  "Sunday": { day: "Sunday", breakfast: ["Chole Kulche", "Tea", "Fruits"], lunch: ["Veg Pulao", "Raita", "Paneer Bhurji", "Roti"], snacks: ["Maggie", "Coffee"], dinner: ["Dum Aloo", "Roti", "Dal Makhani", "Brownie"] },
};

const DEADLINES: AcademicDeadline[] = [
  { id: "d1", courseCode: "CS301", title: "xv6 Memory Management Patch", dueDate: "2026-10-15T23:59:00Z", weightage: 15, portal: "Moodle" },
  { id: "d2", courseCode: "CS304", title: "SQL Normalization Case Study", dueDate: "2026-10-20T23:59:00Z", weightage: 10, portal: "Google Classroom" },
  { id: "d3", courseCode: "CS308", title: "Socket Programming Assignment", dueDate: "2026-10-25T23:59:00Z", weightage: 20, portal: "Github Classroom" }
];

export class AcademicService {
  public getAllCourses(): Course[] {
    return COURSE_CATALOG;
  }

  public getCourseByCode(code: string): Course | null {
    const normalizedQuery = code.replace(/\s+/g, '').toUpperCase();
    return COURSE_CATALOG.find(c => c.code.replace(/\s+/g, '').toUpperCase() === normalizedQuery) || null;
  }

  public getMenuByDay(day: string): DiningMenu | null {
    const normalizedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    return DINING_MENUS[normalizedDay] || null;
  }

  public getPendingDeadlines(): AcademicDeadline[] {
    return DEADLINES;
  }
}
