const CSV_URL = "https://docs.google.com/spreadsheets/d/1KDRPtNekAZ10rPEsTmTyyaDX3QFJlGQSstGdloJKV7c/export?format=csv";
let courses = [];
// Load spreadsheet
Papa.parse(CSV_URL, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function(results) {
    courses = results.data;
    displayCourses(courses);
  }
});

// Display courses
function displayCourses(list) {
  const table = document.getElementById("courseTable");
  table.innerHTML = "";
  
  document.getElementById("count").innerHTML =
  `${list.length} courses found`;
  
  list.slice(0,200).forEach(course => {
  
    let row = document.createElement("tr");
    
    row.innerHTML = `
    <td>${course.Department || ""}</td>
    <td>${course.Level || ""}</td>
    <td>${course.Course_ID || ""}</td>
    <td>${course.Course_Name || ""}</td>
    <td>${course.Credits || ""}</td>
    <td>${course.Duration || ""}</td>
    <td>${course.Max_GPA || ""}</td>
    `;
    
    table.appendChild(row);
  });
}
  
function filterCourses() {
  let search = document.getElementById("search").value.toLowerCase();
  let level = document.getElementById("levelFilter").value;
  let filtered = courses.filter(course => {
    let matchesSearch = (
      (course.Course_Name || "")
      .toLowerCase()
      .includes(search)
      ||
      (course.Department || "")
      .toLowerCase()
      .includes(search)
      ||
      (course.Course_ID || "")
      .toLowerCase()
      .includes(search)
    );
    let matchesLevel = level === "" || course.Level === level;
    return matchesSearch && matchesLevel;
  });
  displayCourses(filtered);
}
