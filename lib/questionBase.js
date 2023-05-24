const inquirer = require("inquirer");

class Question {
  constructor(name, type, message, choices) {
    (this.name = name),
      (this.type = type),
      (this.message = message),
      (this.choices = choices);
  }
  async questionPrompt() {
    return await inquirer.prompt([
      {
        name: this.name,
        type: this.type,
        message: this.message,
        choices: this.choices,
      },
    ]);
  }
}

module.exports = Question;
