const {
  initQuestion,
  AddDeptQuestion,
  ViewDeptQuestion,
  ViewRoleQuestion,
  ViewEmployeeQuestion,
  AddRoleQuestion,
} = require("./lib/questionsExtended");
const sequelize = require("./config/connection");

String.prototype.toNumber = function () {
  return Number(this);
};
const log = console.log;

async function init() {
  while (true) {
    const openQuestion = new initQuestion();
    const initWait = await openQuestion.questionPrompt();
    switch (initWait.initQuestion) {
      case "Add Department":
        const newDept = new AddDeptQuestion();
        await newDept.questionPrompt();
        break;
      case "Add Role":
        const newrole = new AddRoleQuestion();
        const roleData = await newrole.multiPrompt();
        console.log(roleData);

        try {
          await sequelize.query(
            `INSERT INTO role (title, salary, department_id) VALUES ('${
              roleData[0].NewRoleName
            }', ${roleData[1].NewRoleSalary}, ${roleData[2].toNumber()})`
          );
        } catch (err) {
          log(`${err} - This shit fucked`);
        }
        break;
      case "View All Departments":
        const viewDept = new ViewDeptQuestion();
        console.log(await viewDept.questionPrompt());
        break;
      case "View All Employees":
        const viewEmployee = new ViewEmployeeQuestion();
        console.log(await viewEmployee.questionPrompt());
        break;
      case "View All Roles":
        const viewRole = new ViewRoleQuestion();
        console.log(await viewRole.questionPrompt());
        break;
      case "Quit":
        process.exit(0);
    }
  }
}

init();
