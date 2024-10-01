import * as readlineSync from "readline-sync";

interface Professor {
    name: string;
}

interface Subject {
    name: string;
    professor: number;
}

interface Student {
    name: string;
    subjects: number[];
    registration: number;
}

const professors: Professor[] = [];
const subjects: Subject[] = [];
const students: Student[] = [];

function clearScreen() {
    console.clear();
}

function pauseAndReturn() {
    console.log("\nPress Enter to continue...");
    readlineSync.question();
    clearScreen();
}

function menu(): void {
    const options = `  
    <- Academic management system! ->  
    1 - Register professors  
    2 - Register subjects  
    3 - Register students  
    4 - List subjects  
    5 - List professors  
    6 - List students  
    7 - List students by subject  
    8 - List subjects by professor  
    9 - List students by professor  
    0 - Exit  
    `;

    while (true) {
        console.log(options);
        const option: number = Number(readlineSync.question("Choose an option: "));

        if (isNaN(option)) {
            clearScreen();
            console.error("Invalid input! Please enter a number.");
            pauseAndReturn();
            continue;
        }

        clearScreen();
        switch (option) {
            case 1: registerProfessor(); break;
            case 2: registerSubject(); break;
            case 3: registerStudents(); break;
            case 4: listSubjects(); break;
            case 5: listProfessors(); break;
            case 6: listStudents(); break;
            case 7: listStudentsBySubject(); break;
            case 8: listSubjectsByProfessor(); break;
            case 9: listStudentsByProfessor(); break;
            case 0: console.log("Exiting..."); return;
            default: console.error("Invalid option!");
        }
        pauseAndReturn();
    }
}

function registerProfessor(): void {
    console.log("<- Professor registration ->");
    const professorName: string = readlineSync.question("Enter the professor's name: ");

    if (professors.some(professor => professor.name === professorName)) {
        console.error("This professor is already registered!");
    } else {
        professors.push({ name: professorName });
        console.log("Professor successfully registered!");
    }
}

function registerSubject(): void {
    if (professors.length === 0) {
        console.error("There are no registered professors!");
        return;
    }

    console.log("<- Subject registration ->");
    const subjectName: string = readlineSync.question("Enter the subject name: ");

    if (subjects.some(subject => subject.name === subjectName)) {
        console.error("This subject is already registered!");
    } else {
        const professorCode: number = readlineSync.questionInt("Enter the professor code (starting from 1): ") - 1; // Convert to zero-based index
        if (professorCode < 0 || professorCode >= professors.length) {
            console.error("There is no professor registered with the entered code.");
        } else {
            subjects.push({ name: subjectName, professor: professorCode });
            console.log("Subject successfully registered!");
        }
    }
}

function registerStudents(): void {
    if (subjects.length === 0) {
        console.error("There are no registered subjects!");
        return;
    }

    console.log("<- Student registration ->");
    const studentName: string = readlineSync.question("Enter the student's name: ");

    if (students.some(student => student.name === studentName)) {
        console.error("This student is already registered!");
    } else {
        const numSubjects: number = readlineSync.questionInt(`How many subjects will ${studentName} take? `);
        if (numSubjects <= 0 || numSubjects > subjects.length) {
            console.error("Invalid number of subjects!");
        } else {
            const subjectList: number[] = [];
            for (let i = 0; i < numSubjects; i++) {
                const subjectNum: number = readlineSync.questionInt("Enter the subject code (starting from 1): ") - 1; // Convert to zero-based index
                if (!subjectList.includes(subjectNum) && subjectNum >= 0 && subjectNum < subjects.length) {
                    subjectList.push(subjectNum);
                } else {
                    console.error("Invalid or duplicate subject code.");
                }
            }
            let regCode: number;
            do {
                regCode = Math.floor(Math.random() * 10000);
            } while (students.some(student => student.registration === regCode));

            students.push({ name: studentName, subjects: subjectList, registration: regCode });
            console.log("Student successfully registered!");
        }
    }
}

function listEntities<T>(entities: T[], entityName: string, displayFunc: (entity: T, index: number) => void): void {
    if (entities.length === 0) {
        console.error(`There are no registered ${entityName}!`);
    } else {
        console.log(`< - Registered ${entityName} ->`);
        entities.forEach(displayFunc);
    }
}

function listSubjects(): void {
    listEntities(subjects, "subjects", (subject, i) => {
        console.log(`${i + 1} - ${subject.name} - Prof ${professors[subject.professor].name}`);
    });
}

function listProfessors(): void {
    listEntities(professors, "professors", (professor, i) => {
        console.log(`\nCode: ${i + 1} \nName: ${professor.name}`);
        console.log("Subjects:");
        subjects.forEach(subject => {
            if (subject.professor === i) {
                console.log(`- ${subject.name}`);
            }
        });
    });
}

function listStudents(): void {
    listEntities(students, "students", (student) => {
        console.log(`\nRegistration: ${student.registration} \nName: ${student.name}`);
        console.log("Subjects:");
        student.subjects.forEach(code => {
            console.log("-", subjects[code].name);
        });
    });
}

function listStudentsBySubject(): void {
    if (students.length === 0) {
        console.error("There are no registered students!");
        return;
    }

    const subjectCode: number = readlineSync.questionInt("Enter the subject code to see its students (starting from 1): ") - 1; // Convert to zero-based index
    if (subjectCode < 0 || subjectCode >= subjects.length) {
        console.error("There are no subjects registered with this code!");
        return;
    }

    const enrolledStudents = students.filter(student => student.subjects.includes(subjectCode));
    if (enrolledStudents.length === 0) {
        console.error("There are no students enrolled in this subject yet!");
    } else {
        console.log(`< - Students enrolled in ${subjectCode + 1} - ${subjects[subjectCode].name}: ->`);
        enrolledStudents.forEach(student => {
            console.log(`\nRegistration: ${student.registration} \nName: ${student.name}`);
        });
    }
}

function listSubjectsByProfessor(): void {
    if (subjects.length === 0) {
        console.error("There are no registered subjects!");
        return;
    }

    const professorCode: number = readlineSync.questionInt("Enter the professor code to see their subjects (starting from 1): ") - 1; // Convert to zero-based index
    if (professorCode < 0 || professorCode >= professors.length) {
        console.error("There are no professors registered with this code!");
        return;
    }

    const professorSubjects = subjects.filter(subject => subject.professor === professorCode);
    if (professorSubjects.length === 0) {
        console.log(`Prof ${professors[professorCode].name} is not yet associated with any subjects.`);
    } else {
        console.log(`< - Subjects of Prof ${professors[professorCode].name}: ->`);
        professorSubjects.forEach((subject) => {
            const subjectCode = subjects.indexOf(subject) + 1; // Display 1-based index
            console.log(`${subjectCode} - ${subject.name}`);
        });
    }
}

function listStudentsByProfessor(): void {
    if (students.length === 0) {
        console.error("There are no registered students!");
        return;
    }

    const professorCode: number = readlineSync.questionInt("Enter the professor code to see their students (starting from 1): ") - 1; // Convert to zero-based index
    if (professorCode < 0 || professorCode >= professors.length) {
        console.error("There are no professors registered with this code!");
        return;
    }

    const professorStudents = students.filter(student =>
        student.subjects.some(subjectCode => subjects[subjectCode].professor === professorCode)
    );

    if (professorStudents.length === 0) {
        console.log(`There are no students enrolled in subjects of Prof ${professors[professorCode].name} yet.`);
    } else {
        console.log(`< - Students of Prof ${professors[professorCode].name}: ->`);
        professorStudents.forEach(student => {
            console.log(`${student.registration} - ${student.name}`);
        });
    }
}

menu();
