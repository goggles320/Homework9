const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employeeID = 1;
let employeeList = [];
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

function initPrompt(){
    inquirer.prompt([
        {
            type: "input",
            message: "What is your name?",
            name: "manager_name"
        },
        {
            type: "input",
            message:"What is your email address?",
            name: "manager_email"
        },
        {
            type: "input",
            message:"What is your office number?",
            name:"office_number"
        }
    ])
    .then(function(res){
        let managerName = res.manager_name;
        let managerEmail = res.manager_email;
        let managerOffice = res.office_number;
        let manager = new Manager(
            managerName,
            employeeID,
            managerEmail,
            managerOffice
        );

        employeeList.push(manager);

        employeeID++;
        console.log("Now input your employee information")
        employeePrompt();
    })
}

function employeePrompt(){
    inquirer.prompt([
        {
            type: "list",
            message: "Please input the employees role",
            choices:["Engineer","Intern","Potato"],
            name:"type"
        },
        {
            type: "input",
            message:"Please input employee's name",
            name: "name"
        },
        {
            type:"input",
            message:"Please input your employee's email",
            name: "email"
        }
    ])
    .then(function(res){
        let employeeType = res.type;
        let employeeName = res.name;
        let employeeEmail = res.email; 

        if (employeeType ==="Engineer"){
            inquirer.prompt([
                {
                    type: "input",
                    message: "Please input employee's Github username",
                    name: "gitUser"
                },
                {
                    type: "list",
                    message: "Add more employees?",
                    choices: ["Yes","No"],
                    name: "addmore"
                }
            ])
            .then(function(res){
                let employeeGithub = res.gitUser;

                let engineer = new Engineer(
                    employeeName,
                    employeeID,
                    employeeEmail,
                    employeeGithub
                );

                employeeList.push(engineer);
                employeeID++;

                if (res.addmore === "Yes"){
                    employeePrompt();
                }
                else{
                    console.log("test");
                    generatePage();
                    return;
                }
            });
        }
        else{
            inquirer.prompt([
                {
                    type:"input",
                    message:"Please input school/University intern went to",
                    name: "school"
                },
                {
                    type: "list",
                    message: "Add more employees?",
                    choices: ["Yes","No"],
                    name: "addmore"
                }
            ])
            .then(function(res){
                let employeeSchool = res.school;

                let intern = new Intern(
                    employeeName,
                    employeeID,
                    employeeEmail,
                    employeeSchool
                );
                
                employeeList.push(intern);

                employeeID++;

                if (res.addmore === "Yes"){
                    employeePrompt();
                }
                else{
                    console.log("test");
                    generatePage();
                    return;
                }

            })
        }
    })
}
//Function for generating each card for employees
function generatePage(){
    let allCards = "";

    employeeList.forEach(item => {
        let cardString = item.createCard();
        allCards+= cardString;
    });

    let HTML = 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />

        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />

        <script src="https://kit.fontawesome.com/ab3fd93a87.js"crossorigin="anonymous"></script>

        <title>Team Roster</title>
    </head>
    <body>
        <div class="container-fluid bg-danger text-center d-flex align-items-center justify-content-center"style="height: 20vh">
        <div class="h1 text-white" style="display: inline-block;">
            My Team
        </div>
        </div>

    <div class="container mt-5">
        
        <div class="card-deck d-inline-flex justify-content-center">
            ${allCards}
        </div>
        
    </div>
    </body>
    </html>
   `;
   
   //Write to HTML file to display all employee cards
    fs.writeFile("./output/roster.html", HTML, function(err) {
        if (err) {
            return console.log(err);
        }
    });

}

initPrompt();
