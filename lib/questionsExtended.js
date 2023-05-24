const Question = require("./questionBase");
const QuestionMulti = require("./questonMulti");
const sequelize = require("../config/connection");

class initQuestion extends Question {
  constructor() {
    super("initQuestion", "list", "What would you like to do?", [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ]);
  }
}

class ViewEmployeeQuestion extends Question {
  constructor() {
    super();
  }
  async questionPrompt() {
    const dbReq = await sequelize.query(`SELECT * FROM employee;`);
    return `
id\tfirst_name\tlast_name\trole\tmanager
--\t----------\t---------\t----\t-------
${dbReq[0]
  .map((el) => {
    return `${el.id}\t${el.first_name}\t\t${el.last_name}\t\t${el.role_id}\t${el.manager_id}`;
  })
  .join("\n")}
`;
  }
}

class ViewRoleQuestion extends Question {
  constructor() {
    super();
  }
  async questionPrompt() {
    const dbReq = await sequelize.query(`SELECT * FROM role;`);
    return `
id\ttitle\t\tsalary\tdepartment_id 
--\t-----\t\t------\t-------------
${dbReq[0]
  .map((el) => {
    return `${el.id}\t${el.title}\t${el.salary}\t${el.department_id}`;
  })
  .join("\n")}
  `;
  }
}

class ViewDeptQuestion extends Question {
  constructor() {
    super();
  }
  async questionPrompt() {
    const dbReq = await sequelize.query(`SELECT * FROM department;`);
    return `
id\tdepartment_name 
--\t---------------
${dbReq[0]
  .map((el) => {
    return `${el.id}\t${el.department_name}`;
  })
  .join("\n")}
`;
  }
}

class AddDeptQuestion extends Question {
  constructor() {
    super("AddDepartment", "input", "What is the name of the Department?");
  }
  async questionPrompt() {
    const userAnswer = await super.questionPrompt();
    return await sequelize.query(
      `INSERT INTO department (department_name) VALUES ('${userAnswer.AddDepartment}')`
    );
  }
}

class NewRoleQuestion_RoleName extends Question {
  constructor() {
    super("NewRoleName", "input", "What is the name of the role?");
  }
}

class NewRoleQuestion_RoleSalary extends Question {
  constructor() {
    super("NewRoleSalary", "input", "What is the salary of the role?");
  }
}

class NewRoleQuestion_RoleDept extends Question {
  constructor() {
    super("NewRoleDept", "list", "What department does the role belong to?", [
      "asdf",
    ]);
  }
  async questionPrompt() {
    const allDepts = await sequelize.query(
      "SELECT department_name FROM department;"
    );
    this.choices = allDepts[0].map((el) => {
      return `${el.department_name}`;
    });
    return await super.questionPrompt();
  }
}

class AddRoleQuestion extends QuestionMulti {
  constructor() {
    const roleName = new NewRoleQuestion_RoleName();
    const roleSalary = new NewRoleQuestion_RoleSalary();
    const roleDept = new NewRoleQuestion_RoleDept();
    super([roleName, roleSalary, roleDept]);
  }
}

module.exports = {
  query: sequelize.query,
  initQuestion,
  AddDeptQuestion,
  ViewDeptQuestion,
  ViewRoleQuestion,
  ViewEmployeeQuestion,
  AddRoleQuestion,
};
