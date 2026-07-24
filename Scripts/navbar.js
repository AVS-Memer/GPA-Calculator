document.addEventListener("DOMContentLoaded", function() {
  let navbar = document.getElementById("navbar");
  if (!navbar) return;
  navbar.innerHTML = `
    <nav class="navbar">
      <div class="logo"><a href="index.html">GPA Calculator</a></div>
      <div class="nav-links">
        <a href="./">Home</a>
        <a href="catalog">Catalog</a>
        <a href="mySchedule">My Schedule</a>
        <a href="gpa">GPA Calculator</a>
        <a href="whatIf">What If</a>
        <a href="rank">Rank Estimator</a>
      </div>
    </nav>
  `;
});
