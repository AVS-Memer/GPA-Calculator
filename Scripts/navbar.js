document.addEventListener("DOMContentLoaded", function() {
  let navbar = document.getElementById("navbar");
  if (!navbar) return;
  navbar.innerHTML = `
    <nav class="navbar">
      <div class="logo"><a href="index.html">GPA Tracker</a></div>
      <div class="nav-links">
        <a href="index.html">Home</a>
        <a href="mySchedule.html">My Schedule</a>
        <a href="whatIf.html">What If</a>
        <a href="catalog.html">Catalog</a>
        <a href="rank.html">Rank Estimator</a>
        <a href="settings.html">Settings</a>
      </div>
    </nav>
  `;
});
