function getAcademicYear(course){
    if (!course.Time_Period) return null;
    // Ignore summer for academic year detection
    if (course.Time_Period.startsWith("Summer")) return null;
    return course.Time_Period;
}

function getStartYear(timePeriod){
    if (!timePeriod) return null;
    return Number(timePeriod.split("-")[0]);
}

// Check if enough courses exist for each year
function validateRankEligibility(courses, graduationYear){
    let warnings = [];
    if (!graduationYear) {
        warnings.push("Enter your graduation year in settings.");
        return warnings;
    }
    let seniorStart = graduationYear - 1;
    let years = {};
    courses.forEach(course=>{
        if (!course.Time_Period) return;
        // Count summers for enrollment check
        let year;
        if (course.Time_Period.startsWith("Summer")) {
            year = Number(course.Time_Period.replace("Summer ",""))-1;
            year = year+"-"+(year+1);
        } else year = course.Time_Period;

        let start = getStartYear(year);

        // Ignore senior year
        if(start >= seniorStart) return;
        if(!years[year]) years[year]=0;
        years[year]++;
    });



    Object.keys(years).forEach(year=>{


        if(years[year] < 5){

            warnings.push(
                `${year} has only ${years[year]} courses. Add at least 5 courses for a reliable estimate.`
            );

        }

    });



    return warnings;

}



// Remove courses that should not affect GPA

function getSixSemesterCourses(courses, graduationYear){


    let seniorStart =
        graduationYear - 1;


    return courses.filter(course=>{


        if(!course.Time_Period)
            return false;


        // Summer courses do not count toward GPA

        if(course.Time_Period.startsWith("Summer"))
            return false;


        let start =
        getStartYear(course.Time_Period);


        // Remove senior year

        if(start >= seniorStart)
            return false;


        return true;


    });

}



// Main function

function calculateRankEstimate(){


    let myCourses =
        JSON.parse(
            localStorage.getItem("myCourses")
        ) || [];


    let whatIfCourses =
        JSON.parse(
            localStorage.getItem("whatIfCourses")
        ) || [];


    let graduationYear =
        Number(
            localStorage.getItem("graduationYear")
        );



    let projectedCourses =
        [
            ...myCourses,
            ...whatIfCourses
        ];



    let warningBox =
        document.getElementById("rankWarning");


    let warnings =
        validateRankEligibility(
            projectedCourses,
            graduationYear
        );
    if(warnings.length > 0){
        warningBox.style.display="block";
        warningBox.className="warning";
        warningBox.innerHTML =
            "<b>Rank estimate unavailable:</b><br><br>" +
            warnings.join("<br>");
        document.getElementById("result").innerHTML =
            "Top percentage: --";
        return null;
    }

    let gpaCourses =
        getSixSemesterCourses(
            projectedCourses,
            graduationYear
        );


    let result = calculateCoreGPA(gpaCourses);

    warningBox.style.display="none";



    return result.GPA;

}

// 1. Initialize your frozen, un-scrollable calculator widget template
let calculator = Desmos.GraphingCalculator(document.getElementById("calculator"), {
  expressions: false, 
  settingsMenu: false, 
  lockViewport: true
});

// 2. Fetch the "IRL" graph template EXACTLY ONCE on application startup
var graphState = {"version":11,"randomSeed":"9d990c2073baa980166b25c3deb2ee6a","graph":{"viewport":{"xmin":1,"ymin":0,"xmax":6,"ymax":150},"squareAxes":false,"__v12ViewportLatexStash":{"xmin":"1","xmax":"5","ymin":"0","ymax":"120"}},"expressions":{"list":[{"type":"expression","id":"20","color":"#6042a6","latex":"G=0","slider":{"hardMin":true,"hardMax":true,"min":"0","max":"5"}},{"type":"expression","id":"19","color":"#388c46","latex":"P=\\frac{100\\int_{G}^{5}f\\left(x\\right)dx}{T}"},{"type":"expression","id":"23","color":"#2d70b3","latex":"N=\\frac{524\\int_{G}^{5}f\\left(x\\right)dx}{T}"},{"id":"4","type":"table","columns":[{"values":["1.75","2","2.25","2.5"],"hidden":true,"id":"2","color":"#2d70b3","latex":"x_{1}"},{"values":["3","8","11","26","26","44","65","77","92","82","55","33","0"],"hidden":true,"id":"3","color":"#388c46","latex":"y_{1}"}]},{"type":"expression","id":"6","color":"#000000","latex":"x_{1}=1.875+\\left[0...11\\right]0.25"},{"type":"expression","id":"11","color":"#c74440","latex":"f\\left(x\\right)=Ae^{-\\frac{\\left(x-m\\right)^{2}}{2s^{2}}}\\left(1+\\operatorname{erf}\\left(\\frac{\\alpha\\left(x-m\\right)}{s\\sqrt{2}}\\right)\\right)","residualVariable":"e_{1}"},{"type":"expression","id":"25","color":"#6042a6","latex":"y\\le y_{1}\\left\\{\\left|x-x_{1}\\right|\\le0.125\\right\\}","lines":false},{"type":"expression","id":"24","color":"#c74440","latex":"y\\le f\\left(x\\right)\\left\\{x\\ge G\\right\\}"},{"type":"expression","id":"27","color":"#2d70b3","latex":"A=56.8709"},{"type":"expression","id":"29","color":"#6042a6","latex":"m=4.38937"},{"type":"expression","id":"30","color":"#000000","latex":"s=-0.940172"},{"type":"expression","id":"31","color":"#c74440","latex":"\\alpha=2.37359"},{"type":"expression","id":"18","color":"#2d70b3","latex":"T=\\int_{0}^{5}f\\left(x\\right)dx"}]},"includeFunctionParametersInRandomSeed":true,"doNotMigrateMovablePointStyle":true};

calculator.setState(graphState);

// Create a permanent listener handle for your target calculation variable
let P = calculator.HelperExpression({latex: "P"});

P.observe('numericValue', function() {
  if (P.numericValue !== undefined) {
    // REMOVED extra * 100 multiplier since Desmos already multiplies by 100
    let finalCalculatedPercentage = P.numericValue; 
    
    // Update the textual copy inside your dashboard HTML box container
    document.getElementById("result").innerHTML = "Top " + finalCalculatedPercentage.toFixed(1) + "%";
  }
});

window.addEventListener("load", () => {
  let g = calculateRankEstimate();
  if (g !== null) {
    document.getElementById("usedGPA").innerHTML = "Projected Core GPA: " + g.toFixed(3);
    calculator.setExpression({
      id: "20",
      latex: "G="+g
    });
  }
});
