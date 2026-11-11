CREATE DATABASE IF NOT EXISTS aru_hrms;

USE aru_hrms;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    department VARCHAR(100),
    role VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active',
    password VARCHAR(255) NOT NULL,
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'General',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id)
    REFERENCES employees(employee_id)
    ON DELETE CASCADE
);

INSERT INTO employees
(employee_id, name, email, phone, department, role, status, password, joining_date)
VALUES
('EMP001', 'Arun Kumar', 'arun@aruhrms.com', '9876543210',
 'Human Resources', 'HR Manager', 'Active', '123456', '2025-06-10'),

('EMP002', 'Priya Sharma', 'priya@aruhrms.com', '9876543211',
 'IT', 'Software Developer', 'Active', '123456', '2025-07-15'),

('EMP003', 'Rahul Raj', 'rahul@aruhrms.com', '9876543212',
 'Finance', 'Accountant', 'Active', '123456', '2025-08-01');

CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO departments (department_name, description)
VALUES
('Human Resources', 'Employee management and recruitment'),
('IT', 'Technology and software development'),
('Finance', 'Financial and accounting operations'),
('Marketing', 'Marketing and promotion'),
('Operations', 'Business operations and management');