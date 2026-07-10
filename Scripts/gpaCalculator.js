// this is for shared gpaCalculator.js - check line 51
const gradePoints = {
    "A+": 4.00,
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

function calculateCoreGPA(courses) {
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

    // Keep track of courses already counted
    let includedIDs =
        new Set(included.map(c => c.Course_ID));

    // Step 2: Highest GPA course per subject
    let subjectGroups = {};
    courses.forEach(course => {
        if (includedIDs.has(course.Course_ID)) return;
        let points = calculateCourseGPA(course);
        if (points === null) return;
        let subject =
            course.Department || "Other";
        if (!subjectGroups[subject]) subjectGroups[subject] = [];
        subjectGroups[subject].push({
            ...course,
            GPA_Points: points
        });
    });

    Object.keys(subjectGroups).forEach(subject => {
        let bestCourse =
            subjectGroups[subject]
            .sort((a,b) =>
                b.GPA_Points - a.GPA_Points
            )[0];
        included.push(bestCourse);
        includedIDs.add(bestCourse.Course_ID);
    });

    // Step 3: Add remaining AP courses
    courses.forEach(course => {
        if (course.Level !== "AP") return;
        if (includedIDs.has(course.Course_ID)) return;
        let points =
            calculateCourseGPA(course);
        if (points === null) return;
        included.push({
            ...course,
            GPA_Points: points
        });
        includedIDs.add(course.Course_ID);
    });

    // Calculate GPA
    let totalPoints = 0;
    let totalCredits = 0;
    included.forEach(course => {
        let credits =
            Number(course.Credits) || 0;
        totalPoints +=
            course.GPA_Points * credits;
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
