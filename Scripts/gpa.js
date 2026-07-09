let courses = JSON.parse(localStorage.getItem("myCourses")) || [];

// All course GPA
let allCourseResult = calculateAllCourseGPA(courses);

document.getElementById("allCourseGPA").innerHTML = allCourseResult.GPA.toFixed(2);
document.getElementById("allCourseCredits").innerHTML = "Credits: " + allCourseResult.Credits;

// Core GPA
let coreResult = calculateCoreGPA(courses);

document.getElementById("coreGPA").innerHTML = coreResult.GPA.toFixed(2);
document.getElementById("coreCredits").innerHTML = "Credits: " + coreResult.Credits;

let box = document.getElementById("courses");

if (coreResult.Courses.length === 0) box.innerHTML = "Core GPA course breakdown will appear here.";
else {
    coreResult.Courses.forEach(course=>{
        let div =
        document.createElement("div");
        div.className="course";
        div.innerHTML = `
        <b>${course.Course_Name}</b><br>

        ${course.Level}
        |
        ${course.Grade}

        <br>

        GPA Value:
        ${course.GPA_Points.toFixed(2)}

        <br>

        Credits:
        ${course.Credits}
        `;
        box.appendChild(div);
    });
}
