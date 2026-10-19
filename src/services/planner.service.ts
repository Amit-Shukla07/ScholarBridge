import { ExamDetail, StudySession, StudyPlanReport, Course } from "../types/academic.js";

interface CourseCurriculum {
  title: string;
  credits: number;
  modules: string[];
}

const KNOWN_CURRICULUM: Record<string, CourseCurriculum> = {
  "CS301": {
    title: "OPERATING SYSTEMS",
    credits: 4,
    modules: [
      "Process Synchronization (Semaphores, Monitors, Classical IPC)",
      "CPU Scheduling Algorithms (Preemptive/Non-preemptive, Priority, Multi-level)",
      "Memory Management & Paging (Virtual Memory, Page Replacement, TLB)",
      "File Systems & Storage Management (Inodes, Disk Scheduling, Deadlocks)"
    ]
  },
  "CSE 302": {
    title: "OPERATING SYSTEMS",
    credits: 4,
    modules: [
      "Process Synchronization (Semaphores, Monitors, Classical IPC)",
      "CPU Scheduling Algorithms (Preemptive/Non-preemptive, Priority, Multi-level)",
      "Memory Management & Paging (Virtual Memory, Page Replacement, TLB)",
      "File Systems & Storage Management (Inodes, Disk Scheduling, Deadlocks)"
    ]
  },
  "CS304": {
    title: "DATABASE MANAGEMENT SYSTEMS",
    credits: 4,
    modules: [
      "Relational Schema Design & Normalization (1NF, 2NF, 3NF, BCNF, Functional Dependencies)",
      "Advanced SQL Queries, Triggers, Views & Stored Procedures",
      "Transaction Processing & Concurrency Control (ACID, 2PL, Timestamp Ordering)",
      "Storage & File Structure, B+ Tree Indexing & Query Optimization"
    ]
  },
  "CSE 209": {
    title: "DATABASE MANAGEMENT SYSTEMS",
    credits: 4,
    modules: [
      "Relational Schema Design & Normalization (1NF, 2NF, 3NF, BCNF, Functional Dependencies)",
      "Advanced SQL Queries, Triggers, Views & Stored Procedures",
      "Transaction Processing & Concurrency Control (ACID, 2PL, Timestamp Ordering)",
      "Storage & File Structure, B+ Tree Indexing & Query Optimization"
    ]
  },
  "CS308": {
    title: "COMPUTER NETWORKS",
    credits: 4,
    modules: [
      "TCP/IP & OSI Stack Architecture, Physical & Data Link Layer Protocols",
      "Network Layer: IPv4/IPv6 Addressing, Subnetting & Supernetting",
      "Routing Algorithms & Protocols (Dijkstra, Bellman-Ford, OSPF, BGP)",
      "Transport & Application Layer: TCP 3-Way Handshake, Flow & Congestion Control, DNS/HTTP"
    ]
  },
  "CS312": {
    title: "THEORY OF COMPUTATION",
    credits: 4,
    modules: [
      "Finite Automata: DFA, NFA, Regular Expressions & Pumping Lemma for Regular Languages",
      "Context-Free Grammars (CFG), Derivation Trees & Normal Forms (CNF, GNF)",
      "Pushdown Automata (PDA) & Equivalence with CFGs, Pumping Lemma for CFLs",
      "Turing Machines (TM), Halting Problem, Decidability & Undecidability"
    ]
  },
  "CSE 303": {
    title: "MACHINE LEARNING",
    credits: 4,
    modules: [
      "Supervised Learning: Linear Regression, Cost Functions & Gradient Descent",
      "Classification: Logistic Regression, Decision Trees, Random Forests & SVM",
      "Neural Networks: Perceptrons, Multi-Layer Perceptrons & Backpropagation",
      "Unsupervised Learning & Evaluation: K-Means, PCA, Cross-Validation & ROC-AUC"
    ]
  },
  "CSE 305": {
    title: "COMPUTER ORGANIZATION AND ARCHITECTURE",
    credits: 4,
    modules: [
      "Instruction Set Architecture, Addressing Modes & Datapath Design",
      "Pipeline Architecture, Pipeline Hazards (Data/Structural/Control) & Branch Prediction",
      "Memory Hierarchy: Cache Mapping (Direct, Associative), Cache Misses & Virtual Memory",
      "Arithmetic Logic Unit (ALU), Fast Multiplication/Division & I/O Interrupts"
    ]
  },
  "CSE 309": {
    title: "ADVANCED JAVA PROGRAMMING",
    credits: 4,
    modules: [
      "Multithreading, Concurrency Utilities, Thread Pools & Synchronization",
      "Generics, Java Collections Framework (Map, Set, Queue) & Lambda Streams",
      "Database Connectivity: JDBC Architecture, Connection Pooling & Transactions",
      "Enterprise Java: Servlets, JSP Lifecycle & Spring Boot RESTful Web Services"
    ]
  },
  "HIS 251": {
    title: "INTRODUCTION TO GENDER",
    credits: 3,
    modules: [
      "Social Construction of Gender, Sex vs. Gender & Historical Formations",
      "Patriarchal Institutions, Feminist Theories & Epistemologies",
      "Gender, Labor & Economy: Domestic Work, Wage Gap & Care Economy",
      "Intersectionality, Law, Queer Politics & Contemporary Trans Movements"
    ]
  },
  "SEC 302": {
    title: "GENERATIVE AI WITH AGENTIC AI - I",
    credits: 2,
    modules: [
      "Foundational LLMs: Architecture, Tokenization & Prompt Engineering Strategies",
      "Tool Calling, Structured Output & Function Calling Protocols (MCP/API)",
      "Multi-Agent Architectures: Coordinator-Worker, Reflection & Memory Systems",
      "Agentic Deployment: Context Window Management, Safety Filters & Evaluation"
    ]
  }
};

export class PlannerService {
  /**
   * Resolves course details, titles, and curriculum breakdown.
   */
  private resolveCourse(courseCode: string): CourseCurriculum {
    const normalized = courseCode.trim().toUpperCase().replace(/\s+/g, " ");
    const compact = normalized.replace(/\s+/g, "");

    // 1. Direct or compact match in known curriculum
    if (KNOWN_CURRICULUM[normalized]) return KNOWN_CURRICULUM[normalized];
    if (KNOWN_CURRICULUM[compact]) return KNOWN_CURRICULUM[compact];

    // 2. Fallback search by key substring
    for (const [key, curr] of Object.entries(KNOWN_CURRICULUM)) {
      if (key.replace(/\s+/g, "") === compact) return curr;
    }

    // 3. Dynamic generic curriculum for uncatalogued courses
    return {
      title: `${normalized} (Theory & Applications)`,
      credits: 4,
      modules: [
        "Module 1: Fundamental Concepts, Core Principles & Notation",
        "Module 2: Core Analytical Methodologies & Practical Problem Solving",
        "Module 3: Advanced Architectures, Frameworks & Case Analyses",
        "Module 4: Synthesis, High-Yield Proofs & Comprehensive Problem Sets"
      ]
    };
  }

  /**
   * Generates a multi-subject, credit-weighted exam revision plan.
   */
  public generateStudyPlan(
    exams: ExamDetail[],
    dailyHours: number = 4
  ): { report: StudyPlanReport; markdown: string } {
    if (!exams || exams.length === 0) {
      throw new Error("At least one exam must be provided to generate a revision plan.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Parse and validate exams
    const parsedExams = exams.map((e) => {
      const examDate = new Date(`${e.examDate}T00:00:00`);
      const daysUntil = Math.max(1, Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
      const info = this.resolveCourse(e.courseCode);
      return {
        courseCode: e.courseCode.toUpperCase().trim(),
        examDateStr: e.examDate,
        examDate,
        daysUntil,
        title: info.title,
        credits: info.credits,
        modules: info.modules,
        moduleIndex: 0,
        sessionsAllocated: 0
      };
    });

    // Sort by exam date ascending (earliest exams first)
    parsedExams.sort((a, b) => a.examDate.getTime() - b.examDate.getTime());

    // Compute planning duration
    const latestExam = parsedExams[parsedExams.length - 1];
    const totalDays = Math.max(3, latestExam.daysUntil);

    const schedule: StudySession[] = [];

    // Helper to format dates
    const formatDate = (d: Date): string => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
    };

    // 2. Day-by-day allocation loop
    for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + dayOffset);
      const nextDay = new Date(currentDay);
      nextDay.setDate(currentDay.getDate() + 1);

      // Check if tomorrow is an exam day for any subject -> Final 24h Buffer Rule!
      const examTomorrow = parsedExams.find(
        (e) => e.examDate.getFullYear() === nextDay.getFullYear() &&
               e.examDate.getMonth() === nextDay.getMonth() &&
               e.examDate.getDate() === nextDay.getDate()
      );

      if (examTomorrow) {
        schedule.push({
          dayNumber: dayOffset + 1,
          date: formatDate(currentDay),
          courseCode: examTomorrow.courseCode,
          focusSubject: examTomorrow.title,
          durationHours: dailyHours,
          recommendedTopics: [
            "Full-Length Timed Mock Paper",
            "Master Formula & Theorem Cheat Sheet Review",
            "Error Log & High-Yield Pitfalls Clarification"
          ],
          notes: "🚨 FINAL 24H EXAM BUFFER: Zero new syllabus topics. Strictly timed mock paper + formulas + mandatory 8 hours sleep."
        });
        continue;
      }

      // Check which exams are still pending
      const activeExams = parsedExams.filter((e) => e.examDate.getTime() > currentDay.getTime());
      if (activeExams.length === 0) {
        break; // All exams completed
      }

      // Calculate priority score for each active exam:
      // Weight = Credits * (1 + (Urgency factor based on days remaining))
      let highestPriority = activeExams[0];
      let maxScore = -1;

      for (const ex of activeExams) {
        const daysLeft = Math.max(1, Math.ceil((ex.examDate.getTime() - currentDay.getTime()) / (1000 * 60 * 60 * 24)));
        const urgencyWeight = 15 / daysLeft;
        const creditWeight = ex.credits * 1.5;
        const deficitPenalty = (ex.sessionsAllocated === 0 ? 5 : 0);
        const score = (urgencyWeight * 2.0) + creditWeight + deficitPenalty - (ex.sessionsAllocated * 1.2);

        if (score > maxScore) {
          maxScore = score;
          highestPriority = ex;
        }
      }

      // Assign topics from the chosen course's module progression
      const currentModIdx = highestPriority.moduleIndex % highestPriority.modules.length;
      const topic = highestPriority.modules[currentModIdx];
      highestPriority.moduleIndex++;
      highestPriority.sessionsAllocated++;

      const isRevisionRound = highestPriority.sessionsAllocated > highestPriority.modules.length;
      const notes = isRevisionRound
        ? `Advanced Problem Sets & Past Paper PYQ Drills for ${highestPriority.courseCode}.`
        : `Deep Conceptual Mastery & Active Recall Note-taking for Module ${(currentModIdx + 1)}.`;

      schedule.push({
        dayNumber: dayOffset + 1,
        date: formatDate(currentDay),
        courseCode: highestPriority.courseCode,
        focusSubject: highestPriority.title,
        durationHours: dailyHours,
        recommendedTopics: [topic],
        notes
      });
    }

    const report: StudyPlanReport = {
      totalDays,
      dailyHoursAllocated: dailyHours,
      schedule,
      strategyAdvice: "Strict 24h mock buffers applied before every exam. Credit-weighted distribution ensures high-weightage courses receive foundational and secondary revision rounds."
    };

    const markdown = this.formatPlanMarkdown(report, parsedExams);
    return { report, markdown };
  }

  /**
   * Formats the study plan into a publication-grade Markdown dashboard.
   */
  public formatPlanMarkdown(
    report: StudyPlanReport,
    exams: Array<{ courseCode: string; title: string; examDateStr: string; credits: number; daysUntil: number }>
  ): string {
    const examSummaryRows = exams.map((e) => {
      const urgencyBadge = e.daysUntil <= 3 ? "🔴 High" : (e.daysUntil <= 7 ? "🟡 Medium" : "🟢 Planned");
      return `| **${e.courseCode}** | ${e.title} | \`${e.examDateStr}\` | **${e.credits} Credits** | ${e.daysUntil} days | ${urgencyBadge} |`;
    }).join("\n");

    const scheduleRows = report.schedule.map((s) => {
      const isMockBuffer = s.notes.includes("FINAL 24H");
      const dayBadge = isMockBuffer ? `**Day ${s.dayNumber}** 🚨` : `Day ${s.dayNumber}`;
      const courseBadge = isMockBuffer ? `**${s.courseCode} (Mock)**` : `**${s.courseCode}**`;
      const topicsList = s.recommendedTopics.map(t => `• ${t}`).join("<br/>");
      return `| ${dayBadge} | \`${s.date}\` | ${courseBadge} | ${topicsList} | \`${s.durationHours} hrs\` | ${s.notes} |`;
    }).join("\n");

    return `
# 🎯 Multi-Subject Exam Revision Master Plan

> **Plan Overview**: **${report.totalDays} Total Preparation Days** allocated across **${exams.length} Examination Subjects** with **${report.dailyHoursAllocated} hours/day** focused study blocks.

---

### 📋 Examination Portfolio & Urgency Index

| 📘 Course Code | 🎓 Subject Title | 📅 Exam Date | ⚖️ Weight | ⏳ Days Left | 🚦 Urgency |
| :--- | :--- | :--- | :--- | :--- | :--- |
${examSummaryRows}

---

### 🗓️ Day-by-Day Modular Revision Timetable

| 🔢 Day | 📅 Date | 📘 Course | 🎯 Focus Module / Core Topics | ⏱️ Hours | 💡 Strategy & Execution Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
${scheduleRows}

---

### 🧠 High-Yield Strategic Prep Protocol

1. **🔒 24-Hour Final Exam Buffer**: The final 24 hours leading up to each paper are reserved strictly for full timed mock exams, formula sheet memorization, and error-log review. *Never begin new syllabus topics on this buffer day.*
2. **🍅 Pomodoro Deep Work Blocks**: Divide your \`${report.dailyHoursAllocated} hours\` into focused 50-minute review intervals followed by 10-minute active recall breaks without screens.
3. **✍️ Active Recall & Feynman Method**: Instead of re-reading slides, recreate diagrams, derivations, and pseudocode from blank sheets after completing each module.
4. **📊 Formula & Error Repository**: Maintain a 2-page master sheet per subject capturing boundary cases, time-complexities, protocol headers, and normalization rules.
`.trim();
  }
}
