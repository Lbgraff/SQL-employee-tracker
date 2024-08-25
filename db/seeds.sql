\c emp_db

INSERT INTO department ( dept_name )
VALUES ('sales'),('IT'),('HR');

INSERT INTO roles (TITLE,salary,department)
VALUES ('Manager of Sales',12122,1),
('Manager of IT',33440,2),
('Manager of HR',23231,3);

INSERT INTO employee (first_name,last_name,role_id)
VALUES ('Bob','Johnson',1),
('Alan','Jones',2),
('Gary','Adams',3);