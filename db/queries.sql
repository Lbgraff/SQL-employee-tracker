SELECT *
FROM department
JOIN roles ON role.department = department.id;

SELECT *
FROM roles
JOIN employee ON employee.roles = role.id;