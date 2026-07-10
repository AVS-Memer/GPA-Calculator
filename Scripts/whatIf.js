const CSV_URL =
"https://docs.google.com/spreadsheets/d/1KDRPtNekAZ10rPEsTmTyyaDX3QFJlGQSstGdloJKV7c/export?format=csv";

let catalog = [];

let whatIfCourses =
JSON.parse(localStorage.getItem("whatIfCourses")) || [];


Papa.parse(CSV_URL, {
  download:true,
  header:true,
  skipEmptyLines:true,
  complete:function(results){
    catalog = results.data;
    renderScenario();
  }
});

function searchCourses() {
  let query = document.getElementById("search").value.toLowerCase().trim();
  
  let box = document.getElementById("results");
  
  if (query.length < 2) {
    box.innerHTML = "Start typing to search courses.";
    return;
  }
  
  let results = catalog.filter(course => {
    return ((course.Course_Name || "").toLowerCase().includes(query) || (course.Course_ID || "").toLowerCase().includes(query) || (course.Department || "").toLowerCase().includes(query));
  });
  displayResults(results.slice(0,20));
}

function displayResults(results) {
  let box = document.getElementById("results");
  box.innerHTML="";
  results.forEach(course=>{
    let div = document.createElement("div");
    div.className="course-result";
    div.innerHTML=`<b>${course.Course_Name}</b>
    <br>
    ${course.Level}|${course.Department}
    <br>
    Credits:${course.Credits}
    <br>
    <button>Add</button>`;
    div.querySelector("button").onclick=function(){
      addCourse(course);
    };
    box.appendChild(div);
  });
}




function addCourse(course){
  whatIfCourses.push({
    Course_ID: course.Course_ID,
    Course_Name: course.Course_Name,
    Department: course.Department,
    Level: course.Level,
    Credits: Number(course.Credits),
    Graduation_Requirement:
    course.Graduation_Requirement === "TRUE",
    Time_Period:"",
    Grade:""
  });
  saveScenario();
  renderScenario();
}




function renderScenario() {
let table = document.getElementById("scenarioTable");
table.innerHTML="";
whatIfCourses.forEach((course,index)=>{
let row = document.createElement("tr");

row.innerHTML=`

<td>${course.Course_Name}</td>

<td>${course.Level}</td>

<td>${course.Credits}</td>


<td>

<select onchange="changeTime(${index},this.value)">

${timeOptions(course.Time_Period)}

</select>

</td>


<td>

<select onchange="changeGrade(${index},this.value)">

${gradeOptions(course.Grade)}

</select>

</td>


<td>

<button onclick="removeCourse(${index})">
Remove
</button>

</td>

`;



table.appendChild(row);


});


calculateProjected();


}




function calculateProjected(){


let current =
JSON.parse(localStorage.getItem("myCourses"))
|| [];



let combined =
current.concat(whatIfCourses);



let all =
calculateAllCourseGPA(combined);


let core =
calculateCoreGPA(combined);



document.getElementById("gpaResults")
.innerHTML=`

All Course GPA:
<b>${all.GPA.toFixed(2)}</b>
<br>

Core GPA:
<b>${core.GPA.toFixed(2)}</b>

<br><br>

Credits:
${core.Credits}

`;
}




function removeCourse(index){
  whatIfCourses.splice(index,1);
  saveScenario();
  renderScenario();
}



function changeGrade(index,value){
  whatIfCourses[index].Grade=value;
  saveScenario();
  calculateProjected();
}



function changeTime(index,value) {
  whatIfCourses[index].Time_Period=value;
  saveScenario();
  calculateProjected();
}

function saveScenario(){
  localStorage.setItem("whatIfCourses",JSON.stringify(whatIfCourses));
}

function gradeOptions(selected=""){
  let grades = [
  "",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F"
  ];

  return grades.map(g => `<option value="${g}" ${g===selected?"selected":""}>${g || "Select Grade"}</option>`).join("");
}



function timeOptions(selected = "") {
  let graduationYear = Number(localStorage.getItem("graduationYear")) || 2026;

  let periods = [];

  // Start from current possible year
  for (let i = graduationYear; i > 2026; i--) {
    periods.push((i-1)+"-"+i);
    periods.push("Summer "+(i-1));
  }

  return periods.map(p => `<option value="${p}" ${p === selected ? "selected" : ""}>${p}</option>`).join("");
}
