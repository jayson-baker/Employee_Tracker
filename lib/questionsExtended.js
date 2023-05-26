const Question = require("./questionBase");
const QuestionMulti = require("./questonMulti");
const sequelize = require("../config/connection");
const { right } = require("inquirer/lib/utils/readline");

function rightPad(str, padDist = 20) {
  let pad = "";
  for (let i = str.length; i < padDist; i++) {
    pad = pad + " ";
  }
  return str + pad;
}

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

class UpdateEmployee_Name extends Question {
  constructor() {
    super(
      "UpdatedEmployeeName",
      "list",
      "Which employee's role would you like to update?"
    );
  }
  async questionPrompt() {
    const allEmployees = await sequelize.query(
      "SELECT first_name, last_name FROM employee;"
    );
    this.choices = allEmployees[0].map((el) => {
      return `${el.first_name} ${el.last_name}`;
    });
    const userPrompt = await super.questionPrompt();
    const deconEmployeeName = userPrompt.UpdatedEmployeeName.split(" ");
    const updateEmployeeEntry = await sequelize.query(`
      SELECT id 
      FROM employee 
      WHERE first_name = '${deconEmployeeName[0]}' 
      AND last_name = '${deconEmployeeName[1]}'`);
    return `${updateEmployeeEntry[0][0].id}`;
  }
}

class UpdateEmployee_Role extends Question {
  constructor() {
    super(
      "UpdatedEmployeeRole",
      "list",
      "What role do you want to assign the selected employee?"
    );
  }
  async questionPrompt() {
    const allRoles = await sequelize.query("SELECT title FROM role;");
    this.choices = allRoles[0].map((el) => {
      return `${el.title}`;
    });
    const userPrompt = await super.questionPrompt();
    const updateEmployeeEntry = await sequelize.query(
      `SELECT id FROM role WHERE title = '${userPrompt.UpdatedEmployeeRole}'`
    );
    console.log(`Updated employee's role in the database.`);
    return `${updateEmployeeEntry[0][0].id}`;
  }
}

class UpdateEmployeeQuestion extends QuestionMulti {
  constructor() {
    const updateName = new UpdateEmployee_Name();
    const updateRole = new UpdateEmployee_Role();
    super([updateName, updateRole]);
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
  r.salary,
  m.first_name AS manager_first, 
  m.last_name AS manager_last 
FROM employee AS e 
LEFT JOIN role As r
ON e.role_id = r.id
LEFT JOIN (
  SELECT id, first_name, last_name
  FROM employee
  ) AS m ON e.manager_id = m.id
LEFT JOIN department AS d
ON r.department_id = d.id;
`
    );
    return `
${["id", "first_name", "last_name", "title", "department", "salary", "manager"]
  .map((el, i) => {
    if (i === 0) {
      return rightPad(el, 5);
    } else {
      return rightPad(el);
    }
  })
  .join("")}
${["--", "----------", "---------", "-----", "----------", "------", "-------"]
  .map((el, i) => {
    if (i === 0) {
      return rightPad(el, 5);
    } else {
      return rightPad(el);
    }
  })
  .join("")}
${dbReq[0]
  .map((el) => {
    let hasManager = el.manager_first !== null;
    let noManager = null;
    let managerFullName = `${el.manager_first} ${el.manager_last}`;
    const manager = hasManager ? managerFullName : noManager;
    return `${rightPad(el.id.toString(), 5)}${rightPad(
      el.first_name
    )}${rightPad(el.last_name)}${rightPad(el.title)}${rightPad(
      el.department_name
    )}${rightPad(el.salary.toString())}${manager}`;
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
${rightPad("id", 5)}${rightPad("title")}${rightPad("department")}${rightPad(
      "salary"
    )}
${rightPad("--", 5)}${rightPad("-----")}${rightPad("----------")}${rightPad(
      "------"
    )}
${dbReq[0]
  .map((el) => {
    return `${rightPad(el.id.toString(), 5)}${rightPad(el.title)}${rightPad(
      el.department_name
    )}${rightPad(el.salary.toString())}`;
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
${rightPad("id", 5)}${rightPad("department_name")} 
${rightPad("--", 5)}${rightPad("---------------")}
${dbReq[0]
  .map((el) => {
    return `${rightPad(el.id.toString(), 5)}${rightPad(el.department_name)}`;
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
    console.log(`Added ${userAnswer.AddDepartment} to the database.`);
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
    console.log(`Added role to the database.`);
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

class NewEmployeeQuestion_First_Name extends Question {
  constructor() {
    super("NewEmployeeFirst", "input", "What is the employee's first name?");
  }
}

class NewEmployeeQuestion_Last_Name extends Question {
  constructor() {
    super("NewEmployeeLast", "input", "What is the employee's last name?");
  }
}

class NewEmployeeQuestion_Role extends Question {
  constructor() {
    super("NewEmployeeRole", "list", "What is the employee's role?");
  }
  async questionPrompt() {
    const allRoles = await sequelize.query("SELECT title FROM role;");
    this.choices = allRoles[0].map((el) => {
      return `${el.title}`;
    });
    const userPrompt = await super.questionPrompt();
    const newEmployeeEntry = await sequelize.query(
      `SELECT id FROM role WHERE title = '${userPrompt.NewEmployeeRole}'`
    );
    return `${newEmployeeEntry[0][0].id}`;
  }
}

class NewEmployeeQuestion_Manager extends Question {
  constructor() {
    super("NewEmployeeManager", "list", "Who is the employee's manager?", [
      "None",
    ]);
  }
  async questionPrompt() {
    const allEmployees = await sequelize.query(
      "SELECT first_name, last_name FROM employee;"
    );
    this.choices.push(
      ...allEmployees[0].map((el) => {
        return `${el.first_name} ${el.last_name}`;
      })
    );
    const userPrompt = await super.questionPrompt();
    const deconManagerName = userPrompt.NewEmployeeManager.split(" ");
    console.log(`New employee added!`);
    if (userPrompt.NewEmployeeManager == "None") {
      return null;
    }
    const newEmployeeEntry = await sequelize.query(`
      SELECT id 
      FROM employee 
      WHERE first_name = '${deconManagerName[0]}' 
      AND last_name = '${deconManagerName[1]}'`);
    return `${newEmployeeEntry[0][0].id}`;
  }
}

class AddEmployeeQuestion extends QuestionMulti {
  constructor() {
    const employeeName = new NewEmployeeQuestion_First_Name();
    const employeeSalary = new NewEmployeeQuestion_Last_Name();
    const employeeDept = new NewEmployeeQuestion_Role();
    const employeeManager = new NewEmployeeQuestion_Manager();
    super([employeeName, employeeSalary, employeeDept, employeeManager]);
  }
}

module.exports = {
  initQuestion,
  AddDeptQuestion,
  ViewDeptQuestion,
  ViewRoleQuestion,
  ViewEmployeeQuestion,
  AddRoleQuestion,
  AddEmployeeQuestion,
  UpdateEmployeeQuestion,
};
