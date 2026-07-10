// this is for shared gpaCalculator.js - check line 51
const gradePoints = {
    "A": 4.00,
    "A-": 3.66,
    "B+": 3.33,
    "B": 3.00,
    "B-": 2.66,
    "C+": 2.33,
    "C": 2.00,
    "C-": 1.66,
    "D+": 1.33,
    "D": 1.00,
    "D-": 0.66,
    "F": 0.00
};

const coreDepartments = [
    "English",
    "Social Studies",
    "Mathematics",
    "Science",
    "World Languages"
];

function calculateCourseGPA(course){
    let grade = course.Grade;
    if (!grade || grade === "") return null;

    let base = gradePoints[grade];

    if (base === undefined) return null;

    // F is always zero
    if (grade === "F") return 0;

    if (course.Level === "AP") return base + 1.0;
    else if (course.Level === "Honors") return base + 0.5;
    else return base;
}

function calculateAllCourseGPA(courses) {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(course => {
        let points = calculateCourseGPA(course);
        if (points === null) return;
        let credits = Number(course.Credits) || 0;
        totalPoints += points*credits;
        totalCredits += credits;
    });

    return {
        GPA: totalCredits === 0 ? 0 : totalPoints / totalCredits,
        Credits: totalCredits
    };
}

function calculateYearCoreGPA(courses) {
    let included = [];
    // Step 1: Graduation requirements
    courses.forEach(course => {
        if (course.Graduation_Requirement === true) {
            let points = calculateCourseGPA(course);
            if (points !== null) {
                included.push({
                    ...course,
                    GPA_Points: points
                });
            }
        }
    });

    let includedIDs = new Set(included.map(c => c.Course_ID));

    // Step 2: Highest GPA course per core subject
    let subjectGroups = {};
    courses.forEach(course => {
        if (includedIDs.has(course.Course_ID)) return;
        let points = calculateCourseGPA(course);
        if (points === null) return;
        let subject = course.Department || "Other";
        if (!coreDepartments.includes(subject)) return;
        if (!subjectGroups[subject]) subjectGroups[subject] = [];
        subjectGroups[subject].push({
            ...course,
            GPA_Points: points
        });
    });

    Object.keys(subjectGroups).forEach(subject => {
        let bestCourse = subjectGroups[subject].sort((a,b) => b.GPA_Points - a.GPA_Points)[0];
        included.push(bestCourse);
        includedIDs.add(bestCourse.Course_ID);
    });

    // Step 3: Remaining AP courses
    courses.forEach(course => {
        if (course.Level !== "AP") return;
        if (includedIDs.has(course.Course_ID)) return;
        let points = calculateCourseGPA(course);
        if (points === null) return;

        included.push({
            ...course,
            GPA_Points: points
        });
    });

    // Calculate yearly GPA
    let totalPoints = 0;
    let totalCredits = 0;

    included.forEach(course => {
        let credits = Number(course.Credits) || 0;
        totalPoints += course.GPA_Points * credits;
        totalCredits += credits;
    });

    return {
        GPA:
            totalCredits === 0
            ? 0
            : totalPoints / totalCredits,
        Credits: totalCredits,
        Courses: included
    };
}

function calculateCoreGPA(courses) {
    let years = {};
    courses.forEach(course => {
        if (!course.Time_Period) return;
        // Ignore summers
        if (course.Time_Period.toLowerCase().includes("summer")) return;
        if (!years[course.Time_Period]) years[course.Time_Period] = [];
        years[course.Time_Period].push(course);
    });
    
    let totalPoints = 0;
    let totalCredits = 0;
    let allCourses = [];
    let yearlyResults = [];
    
    Object.keys(years).forEach(year => {
        let result = calculateYearCoreGPA(years[year]);
        if (result.Credits === 0) return;
        totalPoints += result.GPA * result.Credits;
        totalCredits += result.Credits;
        allCourses.push(...result.Courses);
        
        yearlyResults.push({
            Year: year,
            ...result
        });
    });

    return {
        GPA:
            totalCredits === 0
            ? 0
            : totalPoints / totalCredits,
        Credits: totalCredits,
        Courses: allCourses,
        Years: yearlyResults
    };
}
