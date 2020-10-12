-- # Unit 12 MySQL Homework: Employee Tracker

-- Developers are often tasked with creating interfaces that make it easy for non-developers to view and interact with information stored in databases. Often these interfaces are known as **C**ontent **M**anagement **S**ystems. In this homework assignment, your challenge is to architect and build a solution for managing a company's employees using node, inquirer, and MySQL.

-- ## Instructions

-- Design the following database schema containing three tables:

-- ![Database Schema](Assets/schema.png)

-- * **department**:

--   * **id** - INT PRIMARY KEY
--   * **name** - VARCHAR(30) to hold department name

-- * **role**:

--   * **id** - INT PRIMARY KEY
--   * **title** -  VARCHAR(30) to hold role title
--   * **salary** -  DECIMAL to hold role salary
--   * **department_id** -  INT to hold reference to department role belongs to

-- * **employee**:

--   * **id** - INT PRIMARY KEY
--   * **first_name** - VARCHAR(30) to hold employee first name
--   * **last_name** - VARCHAR(30) to hold employee last name
--   * **role_id** - INT to hold reference to role employee has
--   * **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager
 
 DROP DATABASE IF EXISTS employee_tracker_db;
 CREATE DATABASE employee_tracker_db;
 USE employee_tracker_db;

 CREATE TABLE departments (
     id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
     name VARCHAR(63) NOT NULL
 );

 CREATE TABLE roles (
     id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(63) NOT NULL,
    salary FLOAT NULL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCEs departments(id)
 );

 CREATE TABLE employees (
     id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
     user_name VARCHAR(63) NOT NULL UNIQUE,
     password VARCHAR(63) NULL,
     access INTEGER(3) NULL DEFAULT 0,
     first_name VARCHAR(31) NULL,
     last_name VARCHAR(31) NULL,
     role_id INTEGER NULL,
     manager_id INTEGER NULL,
     FOREIGN KEY (role_id) REFERENCES roles(id),
     FOREIGN KEY (manager_id) REFERENCES employees(id)
 );

