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
    const dbReq = await sequelize.query(
      `
SELECT 
  e.id, 
  e.first_name, 
  e.last_name,
  r.title,
  d.department_name AS department_name,
  m.first_name AS manager_first, 
  m.last_name AS manager_last 
FROM employee AS e 
LEFT JOIN role As r
ON e.role_id = r.id
LEFT JOIN (
  SELECT id, first_name, last_name
  FROM employee
  ) AS m ON e.manager_id = m.id;
LEFT JOIN department AS d
ON r.department_id = d.id
`
    );
    return `
id\tfirst_name\tlast_name\ttitle\tdepartment\t\tmanager
--\t----------\t---------\t-----\t----------\t\t-------
${dbReq[0]
  .map((el) => {
    let hasManager = el.manager_first !== null;
    let noManager = null;
    let managerFullName = `${el.manager_first} ${el.manager_last}`;
    const manager = hasManager ? managerFullName : noManager;
    return `${el.id}\t${el.first_name}\t\t${el.last_name}\t\t${el.title}\t${el.department_name}\t${manager}`;
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
    const dbReq = await sequelize.query(
      `
SELECT 
  r.id,
  r.title,
  d.department_name,
  r.salary
FROM role AS r
LEFT JOIN department AS d
ON r.department_id = d.id
;`
    );
    return `
id\ttitle\t\tdepartment\tsalary
--\t-----\t\t----------\t------
${dbReq[0]
  .map((el) => {
    return `${el.id}\t${el.title}\t${el.department_name}\t${el.salary}`;
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
    const userPrompt = await super.questionPrompt();
    const newRoleEntry = await sequelize.query(
      `SELECT id FROM department WHERE department_name = '${userPrompt.NewRoleDept}'`
    );
    return `${newRoleEntry[0][0].id}`;
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
