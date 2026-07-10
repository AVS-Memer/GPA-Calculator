const CSV_URL = "https://docs.google.com/spreadsheets/d/1KDRPtNekAZ10rPEsTmTyyaDX3QFJlGQSstGdloJKV7c/export?format=csv";

let catalog = [];

let myCourses = JSON.parse(localStorage.getItem("myCourses")) || [];

// Load catalog

Papa.parse(CSV_URL, {

download:true,

header:true,

skipEmptyLines:true,


complete:function(results){

    catalog = results.data;

    renderSchedule();

}


});





function searchCourses(){

    let query = document
        .getElementById("search")
        .value
        .toLowerCase()
        .trim();


    let box = document.getElementById("results");


    if(query.length < 2){

        box.innerHTML = "Start typing to search courses.";

        return;

    }


    let results = catalog.filter(course => {

        return (

            (course.Course_Name || "")
            .toLowerCase()
            .includes(query)

            ||

            (course.Course_ID || "")
            .toLowerCase()
            .includes(query)

            ||

            (course.Department || "")
            .toLowerCase()
            .includes(query)

        );

    });


    displayResults(results.slice(0,20));

}




function displayResults(results){

    let box = document.getElementById("results");

    box.innerHTML = "";


    if(results.length === 0){

        box.innerHTML =
        "No courses found.";

        return;

    }


    results.forEach((course,index)=>{
        let div=document.createElement("div");
        div.className="course-result";
        div.innerHTML = `
        <b>${course.Course_Name}</b><br>
        Course ID: ${course.Course_ID}<br>
        Department: ${course.Department}<br>
        Level: ${course.Level}<br>
        Credits: ${course.Credits}<br>
        Duration: ${course.Duration}<br>
        <button id="add-${index}">
        Add Course
        </button>
        `;

        div.querySelector("button")
        .onclick = function(){

            addCourse(course);

            this.innerHTML="Added ✓";
            this.disabled=true;

        };


        box.appendChild(div);


    });

}

function clearSearch(){
    document.getElementById("search").value = "";
    document.getElementById("results").innerHTML = "";
}


function addCourse(course){
  let exists = myCourses.some(c => c.Course_ID === course.Course_ID);

  if(exists) {
    alert("Course already added.");
    return;
  }

  myCourses.push({
      Course_ID: course.Course_ID,
      Course_Name: course.Course_Name,
      Department: course.Department,
      Level: course.Level,
      Credits: Number(course.Credits),
      Time_Period: "",
      Grade: ""
  });

  saveCourses();
  renderSchedule();
}



function gradeOptions(selected = "") {
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

    return grades.map(g =>
        `<option value="${g}" ${g === selected ? "selected" : ""}>
            ${g || "Select Grade"}
        </option>`
    ).join("");
}

function timePeriodOptions(selected = "") {
    let periods = [];

    for (let i = 2026; i >= 2020; i--) {
      periods.push("Summer "+i);
      periods.push((i-1)+"-"+i);
    }

    return periods.map(p =>
        `<option value="${p}" ${p === selected ? "selected" : ""}>
            ${p || "No Time Period"}
        </option>`
    ).join("");
}

function renderSchedule(){


let table =
document.getElementById("schedule");


table.innerHTML="";



myCourses.forEach((course,index)=>{


let row=document.createElement("tr");


row.innerHTML=`

<td>${course.Course_Name}</td>

<td>${course.Level}</td>

<td>${course.Credits}</td>

<td>

<select onchange="changeTimePeriod(${index}, this.value)">

${timePeriodOptions(course.Time_Period)}

</select>

</td>

<td>

<select onchange="changeGrade(${index}, this.value)">

${gradeOptions(course.Grade)}

</select>

</td>


<td>

<button class="remove"
onclick="removeCourse(${index})">

Remove

</button>

</td>

`;
table.appendChild(row);
});
}

function changeGrade(index,grade) {
  myCourses[index].Grade = grade;
  saveCourses();
}

function changeTimePeriod(index, value) {
  myCourses[index].Time_Period = value;
  saveCourses();
}

function removeCourse(index){
  myCourses.splice(index,1);
  saveCourses();
  renderSchedule();
}

function saveCourses(){
  localStorage.setItem("myCourses", JSON.stringify(myCourses));
}
