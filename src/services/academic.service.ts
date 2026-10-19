import {
  Course,
  DailyDiningMenu,
  MealSlot,
  MessTimings,
  MessType,
  DiningMenu,
  AcademicDeadline
} from "../types/academic.js";

const COURSE_CATALOG: Course[] = [
  { code: "CSE 302", title: "OPERATING SYSTEMS", instructor: "Dr. Nelatoori Kiran Babu, Dr. Syed Sameen Ahmad Rizvi", credits: 4, room: "(C 903), (V 604)", slot: "Tue 15:00, Thu 13:00, Thu 14:00, Fri 09:00, Fri 10:00" },
  { code: "CSE 303", title: "MACHINE LEARNING", instructor: "Dr. Ch. Anil Carie, Mr. Ajay Dilip Kumar Marapatla", credits: 4, room: "(C 903), (V 604)", slot: "Tue 09:00, Tue 10:00, Thu 11:00, Fri 15:00, Fri 16:00" },
  { code: "CSE 305", title: "COMPUTER ORGANIZATION AND ARCHITECTURE", instructor: "Dr. Anirban Bhar, Dr. Firoj Gazi", credits: 4, room: "(C 903), (V 604)", slot: "Tue 13:00, Tue 14:00, Thu 15:00, Thu 16:00, Fri 14:00" },
  { code: "CSE 309", title: "ADVANCED JAVA PROGRAMMING", instructor: "Dr. Gone Neelakantam, Dr. Paramita Das", credits: 4, room: "(C 903), (S 412)", slot: "Mon 14:00, Mon 15:00, Wed 10:00, Fri 11:00, Fri 12:00" },
  { code: "HIS 251", title: "INTRODUCTION TO GENDER", instructor: "Dr. Lekshmi Chandran CP", credits: 3, room: "(C 404)", slot: "Mon 16:00, Tue 16:00" },
  { code: "SEC 302", title: "GENERATIVE AI WITH AGENTIC AI - I", instructor: "Mr. Careerskill", credits: 2, room: "(C 903)", slot: "Mon 11:00, Mon 12:00, Wed 13:00, Wed 14:00" }
];

export const MESS_TIMINGS: MessTimings = {
  weekdayBreakfast: "7:00 AM – 9:00 AM",
  weekendBreakfast: "7:30 AM – 9:30 AM",
  lunch: "12:00 PM – 2:30 PM",
  snacks: "4:30 PM – 5:45 PM",
  dinner: "7:00 PM – 9:45 PM",
};

// South Indian Mess Weekly Schedule
const SOUTH_MENU: Record<string, DailyDiningMenu> = {
  "monday": {
    day: "Monday",
    breakfast: {
      timing: MESS_TIMINGS.weekdayBreakfast,
      items: ["Pongal", "Medu Wada", "Coconut Chutney (South)", "Sambar", "Whole wheat bread", "Butter/Jam", "Cut Watermelon", "Masala Omelette", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Garden Green Salad", "Dondakaya peanut Fry", "Palak kura Pappu", "Dal Tadka", "Steam Rice", "Chapati", "Curd", "Fresh Chutney", "Fryums"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Bhel Puri", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Kadhai Paneer (Veg)", "Rayalaseema Kodi Curry (South)", "Ginger Rasam", "Steam Rice", "Phulka", "Curd", "Mix veg pickle", "Buttermilk", "Ice Cream"]
    }
  },
  "tuesday": {
    day: "Tuesday",
    breakfast: {
      timing: MESS_TIMINGS.weekdayBreakfast,
      items: ["Carrot Idli / Idli", "Potato green peas korma", "Sambar", "Peanut Chutney", "Whole wheat bread", "Butter/Jam", "Cut Papaya", "Boiled Egg", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Chikkudukaya Vepudu (Beans Fry)", "Mix veg curry", "Toor Dal Fry", "Steam Rice", "Phulka", "Curd", "Mint Rasam", "Fresh Chutney", "Gulab Jamun"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Punugulu & Chutney", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Tomato Drumstick", "Vegetable Sambhar", "Tamarind Rice", "Steam Rice", "Phulka", "Curd", "Fryums", "Pickle", "Buttermilk", "Sweetlime"]
    }
  },
  "wednesday": {
    day: "Wednesday",
    breakfast: {
      timing: MESS_TIMINGS.weekdayBreakfast,
      items: ["Semiyan Upma", "Tomato Chutney", "Whole wheat bread", "Butter/Jam", "Watermelon Juice", "Boiled Egg", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Mixed Veg Poriyal", "Pumpkin Sambar (South)", "Curd rice", "Whole Masoor dal Fry", "Steam Rice", "Chapati", "Fresh chutney", "Fryums"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Herb Tossed Steamed Corn", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Paneer Afghani (Veg)", "Guntur Chicken Curry", "Tomato Rasam", "Steam Rice", "Phulka", "Curd", "Mango pickle", "Buttermilk", "Ice Cream"]
    }
  },
  "thursday": {
    day: "Thursday",
    breakfast: {
      timing: MESS_TIMINGS.weekdayBreakfast,
      items: ["Pesarattu", "Rawa Veg Upma", "Sambhar", "Ginger Chutney", "Whole wheat bread", "Butter/Jam", "Cut Papaya", "Boiled Egg", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Dumpa Vepudu", "Thotakura Pappu", "Dal Makhni", "Steam Rice", "Phulka", "Curd", "Fresh chutney", "Yellow Mysore pak"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Aloo Bonda", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Yam Vepudu", "Bhindi Masala", "Sambar", "Steam Rice", "Phulka", "Curd", "Papad", "Fresh chutney", "Buttermilk", "Guava"]
    }
  },
  "friday": {
    day: "Friday",
    breakfast: {
      timing: MESS_TIMINGS.weekdayBreakfast,
      items: ["Plain idli", "Coconut Chutney", "Tiffin Sambar", "Whole wheat bread", "Butter/Jam", "Banana", "Boiled Egg", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["White Pumpkin Perugu", "Drumstick Sambar", "Dhaba Dal tadka", "Steam Rice", "Chapati", "Curd", "Fresh chutney", "Fryums"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Samosa / Chocolate Swiss roll", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Amritsari Paneer (Veg)", "Gongura kodi curry / Andhra Chicken curry (South)", "Pepper Rasam", "Steam Rice", "Phulka", "Curd", "Mango / Gongura pickle", "Buttermilk", "Ice Cream"]
    }
  },
  "saturday": {
    day: "Saturday",
    breakfast: {
      timing: MESS_TIMINGS.weekendBreakfast,
      items: ["Semiyan Khichdi", "Curd", "Peanut Chutney", "Whole wheat bread", "Butter/Jam", "Cut Watermelon", "Boiled Egg", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Bendakaya Vepudu", "Mudda Pappu", "Ghee", "Pachi Pulusu", "Steam Rice", "Phulka", "Curd", "Mango Pickle", "Rawa Pineapple Kesari with dryfruits & nuts"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Paani Puri", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Methi Chaman (Veg)", "Egg Curry (South)", "Veg Sambhar", "Curry Leaf Rice (South)", "Steam Rice", "Phulka", "Curd", "Rice papad", "Fresh chutney", "Buttermilk", "Banana"]
    }
  },
  "sunday": {
    day: "Sunday",
    breakfast: {
      timing: MESS_TIMINGS.weekendBreakfast,
      items: ["Onion Uttapam", "Mysore Bonda", "Sambar", "Groundnut chutney", "Whole wheat bread", "Butter/Jam", "Banana", "Boiled Egg", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Onion & Lemon Salad", "Lemonade", "Beetroot Poriyal", "Mix Dal Fry (South)", "Steam Rice", "Veg Paneer Biryani", "Hyderabadi Murgh Dum Biryani", "Mirchi Ka Salan", "Veg Raita", "Pickle", "Ice Cream"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Eggless Muffin", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Potato 65", "Yellow dal", "Bisi Bele Bath (South)", "Steam Rice", "Phulka", "Curd", "Appalam", "Mix veg pickle", "Buttermilk", "Sweetlime"]
    }
  }
};

// North Indian Mess Weekly Schedule
const NORTH_MENU: Record<string, DailyDiningMenu> = {
  "monday": {
    day: "Monday",
    breakfast: {
      timing: MESS_TIMINGS.weekdayBreakfast,
      items: ["Malabari Paratha", "Medu Wada", "Sambar", "Coconut Chutney", "Whole wheat bread", "Butter/Jam", "Cut Watermelon", "Masala Omelette", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Garden Green Salad", "Lauki chana dal ki Subzi", "Dal Tadka", "Steam Rice", "Roasted jeera Chapathi", "Chapati", "Curd", "Fresh Chutney", "Fryums"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Bhel Puri", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Kadhai Paneer (Veg)", "Murgh Rogan Josh", "Steam Rice", "Mint Pulao (North)", "Phulka", "Curd", "Mix veg pickle", "Buttermilk", "Ice Cream"]
    }
  },
  "tuesday": {
    day: "Tuesday",
    breakfast: {
      timing: MESS_TIMINGS.weekdayBreakfast,
      items: ["Malabari Paratha", "Potato green peas korma", "Sambar", "Peanut Chutney", "Whole wheat bread", "Butter/Jam", "Cut Papaya", "Egg Bhurji (North)", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Tossed Salad (North)", "Mix veg curry", "Toor Dal Fry", "Steam Rice", "Phulka", "Curd", "Fresh Chutney", "Gulab Jamun"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Punugulu & Chutney", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Aloo Gobi Matar", "Vegetable Sambhar", "Steam Rice", "Phulka", "Curd", "Fryums", "Pickle", "Buttermilk", "Sweetlime"]
    }
  },
  "wednesday": {
    day: "Wednesday",
    breakfast: {
      timing: MESS_TIMINGS.weekdayBreakfast,
      items: ["Chole", "Bhature / Puri", "Tomato Chutney", "Whole wheat bread", "Butter/Jam", "Watermelon Juice", "Boiled Egg", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Green Salad with beetroot (North)", "Soya chunk Masala", "Whole Masoor dal Fry", "Steam Rice", "Kasoori Methi Chapathi", "Chapati", "Curd", "Fresh chutney", "Fryums"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Herb Tossed Steamed Corn", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Paneer Afghani (Veg)", "Chicken Korma", "Coriander Pulao", "Steam Rice", "Phulka", "Curd", "Mango pickle", "Buttermilk", "Ice Cream"]
    }
  },
  "thursday": {
    day: "Thursday",
    breakfast: {
      timing: MESS_TIMINGS.weekdayBreakfast,
      items: ["Rawa Veg Upma", "Sambhar", "Ginger Chutney", "Whole wheat bread", "Butter/Jam", "Cut Papaya", "Egg Bhurji (North)", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Kachumber Salad (North)", "Sprouts Masala", "Dal Makhni", "Steam Rice", "Phulka", "Curd", "Fresh chutney", "Yellow Mysore pak"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Aloo Bonda", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Bhindi Masala", "Mix Veg Pulao", "Sambar", "Steam Rice", "Phulka", "Curd", "Papad", "Fresh chutney", "Buttermilk", "Guava"]
    }
  },
  "friday": {
    day: "Friday",
    breakfast: {
      timing: MESS_TIMINGS.weekdayBreakfast,
      items: ["Veg Burger", "Tomato Ketchup", "Whole wheat bread", "Butter/Jam", "Banana", "Boiled Egg", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Green Salad (North)", "Navratna Korma", "Dhaba Dal tadka", "Steam Rice", "Masala Chapati", "Chapati", "Curd", "Fresh chutney", "Fryums"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Samosa / Chocolate Swiss roll", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Amritsari Paneer (Veg)", "Dhania Murgh", "Jeera Pulao (North)", "Steam Rice", "Phulka", "Curd", "Mango pickle", "Buttermilk", "Ice Cream"]
    }
  },
  "saturday": {
    day: "Saturday",
    breakfast: {
      timing: MESS_TIMINGS.weekendBreakfast,
      items: ["Aloo Paratha (North)", "Curd", "Peanut Chutney", "Whole wheat bread", "Butter/Jam", "Cut Watermelon", "Boiled Egg", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Green Salad (North)", "Rajma masala", "Steam Rice", "Phulka", "Curd", "Mango Pickle", "Rawa Pineapple Kesari with dryfruits & nuts"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Paani Puri", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Methi Chaman (Veg)", "Egg Curry", "Veg Sambhar", "Steam Rice", "Phulka", "Curd", "Rice papad", "Fresh chutney", "Buttermilk", "Banana"]
    }
  },
  "sunday": {
    day: "Sunday",
    breakfast: {
      timing: MESS_TIMINGS.weekendBreakfast,
      items: ["Onion Uttapam", "Mysore Bonda", "Sambar", "Groundnut chutney", "Whole wheat bread", "Butter/Jam", "Banana", "Boiled Egg", "Tea/Coffee/Milk"]
    },
    lunch: {
      timing: MESS_TIMINGS.lunch,
      items: ["Onion & Lemon Salad", "Lemonade", "Steam Rice", "Veg Paneer Biryani", "Hyderabadi Murgh Dum Biryani", "Mirchi Ka Salan", "Veg Raita", "Pickle", "Ice Cream"]
    },
    snacks: {
      timing: MESS_TIMINGS.snacks,
      items: ["Eggless Muffin", "Tea/Coffee/Milk"]
    },
    dinner: {
      timing: MESS_TIMINGS.dinner,
      items: ["Gobi Matar", "Potato 65", "Yellow dal", "Steam Rice", "Phulka", "Curd", "Appalam", "Mix veg pickle", "Buttermilk", "Sweetlime"]
    }
  }
};

// Also index capitalized day names for convenience
for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]) {
  const cap = day.charAt(0).toUpperCase() + day.slice(1);
  SOUTH_MENU[cap] = SOUTH_MENU[day];
  NORTH_MENU[cap] = NORTH_MENU[day];
}

const DEADLINES: AcademicDeadline[] = [
  { id: "d1", courseCode: "CS301", title: "xv6 Memory Management Patch", dueDate: "2026-10-15T23:59:00Z", weightage: 15, portal: "Moodle" },
  { id: "d2", courseCode: "CS304", title: "SQL Normalization Case Study", dueDate: "2026-10-20T23:59:00Z", weightage: 10, portal: "Google Classroom" },
  { id: "d3", courseCode: "CS308", title: "Socket Programming Assignment", dueDate: "2026-10-25T23:59:00Z", weightage: 20, portal: "Github Classroom" }
];

export class AcademicService {
  public southMenu: Record<string, DailyDiningMenu> = SOUTH_MENU;
  public northMenu: Record<string, DailyDiningMenu> = NORTH_MENU;

  public getAllCourses(): Course[] {
    return COURSE_CATALOG;
  }

  public getCourseByCode(code: string): Course | null {
    const normalizedQuery = code.replace(/\s+/g, '').toUpperCase();
    return COURSE_CATALOG.find(c => c.code.replace(/\s+/g, '').toUpperCase() === normalizedQuery) || null;
  }

  public getDiningMenu(
    day: string,
    mess: MessType = "south",
    meal?: "breakfast" | "lunch" | "snacks" | "dinner"
  ): (DailyDiningMenu | (MealSlot & { day: string; meal: string })) | null {
    if (!day) return null;
    const normalizedDay = day.trim().toLowerCase();
    const menuSource = mess === "north" ? this.northMenu : this.southMenu;
    const dayMenu = menuSource[normalizedDay] || null;
    if (!dayMenu) {
      return null;
    }
    if (meal) {
      const slot = dayMenu[meal];
      if (!slot) return null;
      return {
        day: dayMenu.day,
        meal,
        timing: slot.timing,
        items: slot.items
      };
    }
    return dayMenu;
  }

  public getMenuByDay(day: string, mess: MessType = "south"): DailyDiningMenu | null {
    return (this.getDiningMenu(day, mess) as DailyDiningMenu) || null;
  }

  public getTodaysMenu(mess: MessType = "south"): { day: string; isToday: boolean; menu: DailyDiningMenu | null } {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[new Date().getDay()];
    const menuSource = mess === "north" ? this.northMenu : this.southMenu;
    const menu = menuSource[todayName.toLowerCase()] || null;

    return {
      day: todayName,
      isToday: true,
      menu,
    };
  }

  public formatMenuAsMarkdown(dayMenu: DailyDiningMenu, mess: MessType = "south", isToday: boolean = true): string {
    const isNorth = mess.toLowerCase() === "north";
    const messTag = isNorth ? "NORTH INDIAN MESS (NORTH)" : "SOUTH INDIAN MESS (SOUTH)";
    const todayBadge = isToday ? " (TODAY)" : "";

    const formatItems = (items: string[]) => {
      return items.map(item => {
        let text = item.trim();
        if (/watermelon/i.test(text) && !text.startsWith("🍉")) text = `🍉 ${text}`;
        else if (/papaya/i.test(text) && !text.startsWith("🍈")) text = `🍈 ${text}`;
        else if (/ice cream/i.test(text) && !text.startsWith("🍨")) text = `🍨 ${text}`;
        else if (/gulab jamun/i.test(text) && !text.startsWith("🍯")) text = `🍯 ${text}`;
        else if (/mysore pak/i.test(text) && !text.startsWith("✨")) text = `✨ ${text}`;
        else if (/kesari/i.test(text) && !text.startsWith("🍍")) text = `🍍 ${text}`;
        else if (/paneer/i.test(text) && !text.startsWith("🧀")) text = `🧀 ${text}`;
        else if (/(chicken|kodi|murgh|biryani)/i.test(text) && !text.startsWith("🍗") && !text.startsWith("🍚")) text = `🍗 ${text}`;
        else if (/(omelette|boiled egg|egg curry|egg bhurji)/i.test(text) && !text.startsWith("🥚")) text = `🥚 ${text}`;
        else if (/(tea\/coffee\/milk|lemonade|buttermilk)/i.test(text) && !text.startsWith("☕") && !text.startsWith("🥛")) text = `☕ ${text}`;
        return text;
      }).join(", ");
    };

    return `
# 🍽️ SRM-AP Central Dining Portal
### 📅 ${dayMenu.day.toUpperCase()}${todayBadge} • [ ${messTag} ]

| 🕒 MEAL | 🍴 ITEMS | ⏰ TIMINGS |
| :--- | :--- | :--- |
| **🌅 BREAKFAST** | ${formatItems(dayMenu.breakfast.items)} | \`${dayMenu.breakfast.timing}\` |
| **🍛 LUNCH** | ${formatItems(dayMenu.lunch.items)} | \`${dayMenu.lunch.timing}\` |
| **☕ SNACKS** | ${formatItems(dayMenu.snacks.items)} | \`${dayMenu.snacks.timing}\` |
| **🌙 DINNER** | ${formatItems(dayMenu.dinner.items)} | \`${dayMenu.dinner.timing}\` |

> 📌 **Mess Timings Reference**:
> - **Breakfast**: Weekdays \`${MESS_TIMINGS.weekdayBreakfast}\` | Weekends \`${MESS_TIMINGS.weekendBreakfast}\`
> - **Lunch**: \`${MESS_TIMINGS.lunch}\` | **Snacks**: \`${MESS_TIMINGS.snacks}\` | **Dinner**: \`${MESS_TIMINGS.dinner}\`
`.trim();
  }

  public getMessTimings(): MessTimings {
    return MESS_TIMINGS;
  }

  public getPendingDeadlines(): AcademicDeadline[] {
    return DEADLINES;
  }
}
