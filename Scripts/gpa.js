let courses = JSON.parse(localStorage.getItem("myCourses")) || [];

let result = calculateAllCourseGPA(courses);

document.getElementById("gpa").innerHTML = result.GPA.toFixed(2);

document.getElementById("credits").innerHTML = "Credits counted: " + result.Credits;

let box = document.getElementById("courses");

if (result.Courses.length === 0) box.innerHTML = "No graded courses found.";

else {
  result.Courses.forEach(course=>{
    let div = document.createElement("div");
    div.className="course";
    div.innerHTML =
    `
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
