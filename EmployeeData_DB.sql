CREATE DATABASE EmployeeData_DB;
USE EmployeeData_DB;

CREATE TABLE departments (
  id int AUTO_INCREMENT,
  deptname varchar(30) NOT NULL,
  PRIMARY KEY(id)
);


CREATE TABLE roles (
  id int AUTO_INCREMENT,
  roletitle varchar(30) NOT NULL,
  salary DECIMAL(8,2) NOT NULL,
  deptid INT(2) NOT NULL,
  PRIMARY KEY(id)
);


CREATE TABLE employees (
  id int AUTO_INCREMENT,
  firstname varchar(30) NOT NULL,
  lastname varchar(30) NOT NULL,
  roleid INT(2) NOT NULL,
  managerid INT(2)
  PRIMARY KEY(id)
);





INSERT INTO actors (name, coolness_points, attitude) VALUES ("Jerry", 90, "relaxed");
INSERT INTO actors (name, coolness_points, attitude) VALUES ("Elaine", 80, "righteous");
INSERT INTO actors (name, coolness_points, attitude) VALUES ("Kramer", 20, "doofus");
INSERT INTO actors (name, coolness_points, attitude) VALUES ("George", 70, "selfish");

SELECT * FROM actors WHERE attitude = 'relaxed';