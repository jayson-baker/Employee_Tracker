INSERT INTO department (id, department_name)
VALUES 
    (001, "Sales"),
    (002, "Engineering"),
    (003, "Finance"),
    (004, "Legal");

INSERT INTO role (id, title, salary, department_id) 
VALUES 
    (001, "Sales Lead", 100000, 001),
    (002, "Salesperson", 80000, 001),
    (003, "Lead Engineer", 150000, 002), 
    (004, "Software Engineer", 120000, 002), 
    (005, "Account Manager", 160000, 003), 
    (006, "Accountant", 125000, 003), 
    (007, "Legal Team Lead", 250000, 004), 
    (008, "Lawyer", 190000, 004);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (001, "William", "Elliot", 003, null),
    (002, "Jayson", "Baker", 004, 001),
    (003, "Cat", "Scarlett", 007, null),
    (004, "Jake", "Whistle", 008, 003),
    (005, "Joe", "Gold", 001, null),
    (006, "Adam", "Talker", 002, 005),
    (007, "Ashley", "Cruncher", 005, null),
    (008, "Josh", "Numbers", 006, 007);



