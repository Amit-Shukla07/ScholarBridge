import { FacultyMember } from "../types/academic.js";

export class FacultyService {
  private facultyList: FacultyMember[] = [
    {
      id: "lekshmi-chandran",
      name: "Dr Lekshmi Chandran C P",
      designation: "Assistant Professor",
      department: "Department of History",
      email: "lekshmi.c@srmap.edu.in",
      officeLocation: {
        block: "Main Academic Block",
        level: "N/A",
        roomOrCubicle: "Not specified",
        rawLocation: "Office Location Not Listed",
      },
      avatarUrl: "assets/faculty/lekshmi-chandran.jpg",
      socialLinks: { linkedin: true, googleScholar: true, scopus: true, orcid: true },
    },
    {
      id: "nelatoori-kiran-babu",
      name: "Dr Nelatoori Kiran Babu",
      designation: "Assistant Professor",
      department: "Department of Computer Science and Engineering",
      email: "kiranbabu.n@srmap.edu.in",
      officeLocation: {
        block: "Homi J Bhabha Block",
        level: "Level 3",
        roomOrCubicle: "Cubicle No: 22",
        rawLocation: "Homi J Bhabha Block, Level 3, Cubicle No: 22",
      },
      avatarUrl: "assets/faculty/nelatoori-kiran-babu.jpg",
      socialLinks: { linkedin: true, googleScholar: true, scopus: true, orcid: true },
    },
    {
      id: "ch-anil-carie",
      name: "Dr Ch Anil Carie",
      designation: "Associate Professor",
      department: "Department of Computer Science and Engineering",
      email: "anilcarie.c@srmap.edu.in",
      officeLocation: {
        block: "J C Bose Block",
        level: "Level 2",
        roomOrCubicle: "Cabin No: 205, Networking Lab",
        rawLocation: "J C Bose Block, Level 2, Cabin No: 205, Networking Lab",
      },
      avatarUrl: "assets/faculty/ch-anil-carie.jpg",
      socialLinks: { linkedin: true, googleScholar: true, scopus: true, orcid: true },
    },
    {
      id: "ajay-marapatla",
      name: "Mr Ajay Dilip Kumar Marapatla",
      designation: "Assistant Professor",
      department: "Department of Computer Science and Engineering",
      email: "ajaydilipkumar.m@srmap.edu.in",
      officeLocation: {
        block: "Homi J Bhabha Block",
        level: "Level 2",
        roomOrCubicle: "Cubicle No: 5",
        rawLocation: "Homi J Bhabha Block, Level 2, Cubicle No: 5",
      },
      avatarUrl: "assets/faculty/ajay-marapatla.jpg",
      socialLinks: { linkedin: true, googleScholar: true, scopus: true, orcid: true },
    },
    {
      id: "anirban-bhar",
      name: "Dr Anirban Bhar",
      designation: "Assistant Professor",
      department: "Department of Computer Science and Engineering",
      email: "anirban.bh@srmap.edu.in",
      officeLocation: {
        block: "CV Raman Block",
        level: "Level 3",
        roomOrCubicle: "Cabin No: 4",
        rawLocation: "CV Raman Block, Level 3, Cabin No: 4",
      },
      avatarUrl: "assets/faculty/anirban-bhar.jpg",
      socialLinks: { linkedin: true, googleScholar: true, scopus: true, orcid: true },
    },
    {
      id: "bhagwat-ram",
      name: "Dr Bhagwat Ram",
      designation: "Assistant Professor",
      department: "Department of Computer Science and Engineering",
      email: "bhagwat.r@srmap.edu.in",
      officeLocation: {
        block: "Homi J Bhabha Block",
        level: "Level 3",
        roomOrCubicle: "Cubicle No: 32",
        rawLocation: "Homi J Bhabha Block, Level 3, Cubicle No: 32",
      },
      avatarUrl: "assets/faculty/bhagwat-ram.jpg",
      socialLinks: { linkedin: true, googleScholar: true, scopus: true, orcid: true },
    },
    {
      id: "neelakantam-gone",
      name: "Dr Neelakantam Gone",
      designation: "Assistant Professor",
      department: "Department of Computer Science and Engineering",
      email: "neelakantam.g@srmap.edu.in",
      officeLocation: {
        block: "CV Raman Block",
        level: "Level 11",
        roomOrCubicle: "Cubicle No: 130",
        rawLocation: "CV Raman Block, Level 11, Cubicle No: 130",
      },
      avatarUrl: "assets/faculty/neelakantam-gone.jpg",
      socialLinks: { linkedin: true, googleScholar: true, scopus: true, orcid: true },
    },
    {
      id: "paramita-das",
      name: "Dr Paramita Das",
      designation: "Assistant Professor",
      department: "Department of Computer Science and Engineering",
      email: "paramita.d@srmap.edu.in",
      officeLocation: {
        block: "CV Raman Block",
        level: "Level 11",
        roomOrCubicle: "Cubicle No: 121",
        rawLocation: "CV Raman Block, Level 11, Cubicle No: 121",
      },
      avatarUrl: "assets/faculty/paramita-das.jpg",
      socialLinks: { linkedin: true, googleScholar: true, scopus: true, orcid: true },
    },
  ];

  async searchFaculty(query: string): Promise<FacultyMember[]> {
    const q = query.trim().toLowerCase();
    if (!q) return this.facultyList;
    return this.facultyList.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q) ||
        f.officeLocation.rawLocation.toLowerCase().includes(q) ||
        f.officeLocation.block.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q)
    );
  }

  async getAllFaculty(): Promise<FacultyMember[]> {
    return this.facultyList;
  }
}

export const facultyService = new FacultyService();
