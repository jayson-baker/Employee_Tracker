const {
  initQuestion,
  AddDeptQuestion,
  ViewDeptQuestion,
  ViewRoleQuestion,
  ViewEmployeeQuestion,
  AddRoleQuestion,
  AddEmployeeQuestion,
  UpdateEmployeeQuestion,
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

        try {
          await sequelize.query(`
            INSERT INTO role (title, salary, department_id) 
            VALUES ('${roleData[0].NewRoleName}', ${
            roleData[1].NewRoleSalary
          }, ${roleData[2].toNumber()});`);
        } catch (err) {
          log(`${err}`);
        }
        break;
      case "Update Employee Role":
        const updateEmpRole = new UpdateEmployeeQuestion();
        const updateData = await updateEmpRole.multiPrompt();

        try {
          await sequelize.query(`
           UPDATE employee
           SET role_id = ${updateData[1].toNumber()}
           WHERE id = ${updateData[0].toNumber()};`);
        } catch (err) {
          log(`${err}`);
        }
        break;
      case "Add Employee":
        const newEmployee = new AddEmployeeQuestion();
        const employeeData = await newEmployee.multiPrompt();

        try {
          await sequelize.query(`
            INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES (
            '${employeeData[0].NewEmployeeFirst}', 
            '${employeeData[1].NewEmployeeLast}', 
            ${employeeData[2].toNumber()},
            ${employeeData[3] ? employeeData[3].toNumber() : null});`);
        } catch (err) {
          log(`${err}`);
        }
        break;
      case "View All Departments":
        const viewDept = new ViewDeptQuestion();
        log(await viewDept.questionPrompt());
        break;
      case "View All Employees":
        const viewEmployee = new ViewEmployeeQuestion();
        log(await viewEmployee.questionPrompt());
        break;
      case "View All Roles":
        const viewRole = new ViewRoleQuestion();
        log(await viewRole.questionPrompt());
        break;
      case "Quit":
        process.exit(0);
    }
  }
}

init();
