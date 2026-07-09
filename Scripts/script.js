let courses =
JSON.parse(localStorage.getItem("myCourses"))
|| [];


function loadProfile(){

    let year =
    localStorage.getItem("graduationYear");


    if(year){

        document.getElementById("gradYear").value = year;

    }

}



function saveProfile() {

    let year =
    document.getElementById("gradYear").value;


    localStorage.setItem(
        "graduationYear",
        year
    );

}

function updateDashboard() {
    document.getElementById("courseCount")
    .innerHTML =
    courses.length;

    let credits =
    courses.reduce(
        (sum,c)=>sum + Number(c.Credits || 0),
        0
    );

    document.getElementById("creditCount")
    .innerHTML =
    credits;

    let periods =
    [...new Set(
        courses
        .map(c=>c.Time_Period)
        .filter(Boolean)
    )];
    document.getElementById("periodCount").innerHTML = periods.length;
    displayCourses();
}

function displayCourses(){
  let box =
  document.getElementById("courses");


  if (courses.length===0) {
    box.innerHTML = "No courses added yet.";
    return;
  }

  let grouped = {};

  courses.forEach(course=>{
    let period =
    course.Time_Period || "No Time Period";
    if(!grouped[period]) grouped[period] = [];
    grouped[period].push(course);
  });

  box.innerHTML="";

  Object.keys(grouped).forEach(period=>{
    let title = document.createElement("div");
    title.className = "period";
    title.innerHTML = period;
    box.appendChild(title);
    grouped[period].forEach(course=>{
      let div = document.createElement("div");
      div.className="course";
      div.innerHTML = `
      ${course.Course_Name}
      (${course.Level})
      -
      ${course.Grade || "No Grade"}
      <br>
      ${course.Credits} credits
      `;
      box.appendChild(div);
    });
  });
}

loadProfile();
updateDashboard();
