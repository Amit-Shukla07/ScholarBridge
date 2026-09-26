import { Course, DiningMenu, AcademicDeadline } from "../types/academic.js";

const COURSE_CATALOG: Course[] = [
  { code: "CS301", title: "Operating Systems", instructor: "Dr. A. Sharma", credits: 4, room: "Hall 302, Academic Block 2", slot: "Mon 10:00, Wed 10:00" },
  { code: "CS304", title: "DBMS", instructor: "Prof. S. Gupta", credits: 4, room: "Hall 305, Academic Block 2", slot: "Tue 11:00, Thu 11:00" },
  { code: "CS308", title: "Computer Networks", instructor: "Dr. R. Singh", credits: 3, room: "Lab 4, Computing Center", slot: "Fri 14:00" },
  { code: "CS312", title: "Theory of Computation", instructor: "Dr. K. Patel", credits: 3, room: "Hall 201, Academic Block 1", slot: "Mon 14:00, Wed 14:00" }
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
    return COURSE_CATALOG.find(c => c.code === code) || null;
  }

  public getMenuByDay(day: string): DiningMenu | null {
    const normalizedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    return DINING_MENUS[normalizedDay] || null;
  }

  public getPendingDeadlines(): AcademicDeadline[] {
    return DEADLINES;
  }
}
