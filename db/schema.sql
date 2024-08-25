DROP DATABASE IF EXISTS emp_db;
CREATE DATABASE emp_db;

\c emp_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department INTEGER,
 FOREIGN KEY (department) references department(id)
 On delete cascade 
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER,
 FOREIGN KEY (role_id) references roles(id)
 On delete cascade,
FOREIGN KEY (manager_id) references employee(id) ON delete SET NULL
);