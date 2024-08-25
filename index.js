const { Pool } = require('pg');
const inquirer = require('inquirer');
const pool = new Pool(
  {
    // TODO: Enter PostgreSQL username
    user: 'postgres',
    // TODO: Enter PostgreSQL password
    password: 'postgres',
    host: 'localhost',
    database: 'emp_db'
  },
  console.log(`Connected to the books_db database.`)
)

pool.connect();

function init() {
  inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "What would you like to do?",
      choices: ["View Department", "View Roles", "View Employee", "Add Department", "Add Roles", "Add Employee", "Update Employee", "Exit Application"]
    }
  ]).then(({ option }) => {
    switch (option) {
      case "View Department":
        viewDepartment();
        break;
      case "View Roles":
        viewRoles();
        break;
      case "View Employee":
        viewEmployee();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Add Roles":
        addRoles();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee":
        updateEmployee();
        break;
      case "Exit Application":
        pool.end()
        process.exit(0);
    }
  })
}

function viewDepartment() {
  pool.query("SELECT * FROM DEPARTMENT;")
    .then(({ rows }) => {

      console.table(rows)
      init()

    }).catch(err => {
      console.error(err)
    })
}

function viewRoles() {
  pool.query("SELECT r.id,d.dept_name,r.title,r.salary FROM ROLES r LEFT JOIN DEPARTMENT d ON d.id = r.department;")
    .then(({ rows }) => {

      console.table(rows)
      init()

    }).catch(err => {
      console.error(err)
    })
}

function viewEmployee() {
  pool.query("SELECT e.id,e.first_name,e.last_name, r.title,r.salary,d.dept_name FROM EMPLOYEE e LEFT JOIN roles r on e.role_id =  r.id  LEFT JOIN DEPARTMENT d ON  d.id = r.department;")
    .then(({ rows }) => {

      console.table(rows)
      init()

    }).catch(err => {
      console.error(err)
    })
}

function addDepartment() {
  inquirer.prompt([
    {
      type: "input",
      message: "enter department",
      name: "departmentName"
    }
  ]).then(({ departmentName }) => {
    pool.query("INSERT INTO department ( dept_name ) VALUES ($1);", [departmentName])
      .then(({ rows }) => {

        console.log('Department added')
        init()

      }).catch(err => {
        console.error(err)
      })
  })
}

function addRoles() {
  pool.query("SELECT ID AS VALUE, DEPT_NAME AS NAME FROM department;")
    .then(({ rows }) => {
      console.log(rows)
      return rows
    }).then((department) => {

      inquirer.prompt([
        {
          type: "input",
          message: "enter title",
          name: "title"
        },
        {
          type: "input",
          message: "enter salary",
          name: "salary"
        },
        {
          type: "list",
          message: "enter department",
          name: "enterDepartment",
          choices: department
        }
      ]).then(({ title, salary, enterDepartment }) => {

        pool.query("INSERT INTO roles ( title,salary,department ) values($1,$2,$3);", [title, salary, enterDepartment])
          .then(({ rows }) => {

            console.table(rows)
            init()

          }).catch(err => {
            console.error(err)
          })
      })

    })
}

function addEmployee() {
  inquirer.prompt([
    {
      type: "input",
      message: "enter first name",
      name: "firstName"
    },
    {
      type: "input",
      message: "enter last name",
      name: "lastName"
    },
    {
      type: "input",
      message: "enter role",
      name: "role"
    },
    {
      type: "input",
      message: "enter manager",
      name: "manager"
    }
  ]).then(({ firstName, lastName, role, manager }) => {

    pool.query("INSERT INTO employee ( first_name,last_name,role_id,manager_id ) values($1,$2,$3,$4);", [firstName, lastName, role, manager])
      .then(({ rows }) => {

        console.table(rows)
        init()

      }).catch(err => {
        console.error(err)
      })

  })
}

function updateEmployee() {
  pool.query("SELECT ID AS VALUE, CONCAT(FIRST_NAME,', ',LAST_NAME) AS NAME FROM EMPLOYEE;")
    .then(({ rows }) => {
      // console.log(rows)
      return rows
    }).then(employees => {
      pool.query("SELECT ID AS VALUE, TITLE AS NAME FROM roles;")
        .then(({ rows }) => {
          rolesRec = rows
          return ({ employees, rolesRec })
        })
        .then(({ employees, rolesRec }) => {
          console.log(employees, rolesRec)

          inquirer.prompt([
            {
              type: "list",
              message: "select employee",
              name: "employee",
              choices: employees
            },
            {
              type: "list",
              name: "role",
              choices: rolesRec,
              message: "enter new role"
            }
          ]).then(({ employee, role }) => {

            pool.query("UPDATE employee SET ROLE_ID = $1 WHERE ID= $2;", [employee, role])
              .then(({ rows }) => {

                console.log(rows)
                init()

              }).catch(err => {
                console.error(err)
              })
          })
        })
    })
}

init()