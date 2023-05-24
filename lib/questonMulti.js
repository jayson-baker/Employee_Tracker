const inquirer = require("inquirer");

class QuestionMulti {
  constructor(questions) {
    this.questions = questions;
  }
  async multiPrompt() {
    const dataArray = [];
    for (const question of this.questions) {
      const answer = await question.questionPrompt();
      dataArray.push(answer);
    }
    return dataArray;
  }
}

module.exports = QuestionMulti;
