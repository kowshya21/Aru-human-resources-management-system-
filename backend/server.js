const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ARU HRMS Backend is running 🚀"
    });
});


// Temporary employee data
// Later MySQL database connect pannuvom
let employees = [
    {
        id: "EMP001",
        name: "Kowshya",
        email: "kowshya@gmail.com",
        phone: "9876543210",
        department: "CSE",
        role: "Developer",
        status: "Active"
    },
    {
        id: "EMP002",
        name: "Rahul",
        email: "rahul@gmail.com",
        phone: "9876543211",
        department: "IT",
        role: "Tester",
        status: "Active"
    }
];


// -------------------------
// GET ALL EMPLOYEES
// -------------------------

app.get("/api/employees", (req, res) => {

    res.json({
        success: true,
        count: employees.length,
        employees: employees
    });

});


// -------------------------
// GET SINGLE EMPLOYEE
// -------------------------

app.get("/api/employees/:id", (req, res) => {

    const employee = employees.find(
        emp => emp.id === req.params.id
    );

    if (!employee) {

        return res.status(404).json({
            success: false,
            message: "Employee not found"
        });

    }

    res.json({
        success: true,
        employee: employee
    });

});


// -------------------------
// ADD EMPLOYEE
// -------------------------

app.post("/api/employees", (req, res) => {

    const {
        id,
        name,
        email,
        phone,
        department,
        role,
        status
    } = req.body;


    if (!id || !name || !email || !department || !role) {

        return res.status(400).json({
            success: false,
            message: "Please fill all required fields"
        });

    }


    const existingEmployee = employees.find(
        emp => emp.id === id
    );


    if (existingEmployee) {

        return res.status(409).json({
            success: false,
            message: "Employee ID already exists"
        });

    }


    const newEmployee = {
        id,
        name,
        email,
        phone: phone || "",
        department,
        role,
        status: status || "Active"
    };


    employees.push(newEmployee);


    res.status(201).json({
        success: true,
        message: "Employee added successfully",
        employee: newEmployee
    });

});


// -------------------------
// UPDATE EMPLOYEE
// -------------------------

app.put("/api/employees/:id", (req, res) => {

    const employeeIndex = employees.findIndex(
        emp => emp.id === req.params.id
    );


    if (employeeIndex === -1) {

        return res.status(404).json({
            success: false,
            message: "Employee not found"
        });

    }


    employees[employeeIndex] = {
        ...employees[employeeIndex],
        ...req.body,
        id: req.params.id
    };


    res.json({
        success: true,
        message: "Employee updated successfully",
        employee: employees[employeeIndex]
    });

});


// -------------------------
// DELETE EMPLOYEE
// -------------------------

app.delete("/api/employees/:id", (req, res) => {

    const employeeIndex = employees.findIndex(
        emp => emp.id === req.params.id
    );


    if (employeeIndex === -1) {

        return res.status(404).json({
            success: false,
            message: "Employee not found"
        });

    }


    const deletedEmployee =
        employees.splice(employeeIndex, 1);


    res.json({
        success: true,
        message: "Employee deleted successfully",
        employee: deletedEmployee[0]
    });

});


// -------------------------
// REGISTER
// -------------------------

app.post("/api/register", (req, res) => {

    const {
        name,
        employeeId,
        email,
        department,
        role,
        password
    } = req.body;


    if (
        !name ||
        !employeeId ||
        !email ||
        !department ||
        !role ||
        !password
    ) {

        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });

    }


    const existingEmployee = employees.find(
        emp =>
            emp.id === employeeId ||
            emp.email === email
    );


    if (existingEmployee) {

        return res.status(409).json({
            success: false,
            message: "Employee already registered"
        });

    }


    const newEmployee = {

        id: employeeId,

        name: name,

        email: email,

        phone: "",

        department: department,

        role: role,

        status: "Active"

    };


    employees.push(newEmployee);


    res.status(201).json({
        success: true,
        message: "Registration successful",
        employee: newEmployee
    });

});


// -------------------------
// LOGIN
// -------------------------

app.post("/api/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });

    }


    const employee = employees.find(
        emp => emp.email === email
    );


    if (!employee) {

        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });

    }


    res.json({
        success: true,
        message: "Login successful",
        employee: employee
    });

});


// -------------------------
// SERVER
// -------------------------

app.listen(PORT, () => {

    console.log(
        `ARU HRMS server running on port ${PORT}`
    );

});