const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =========================
// HOME
// =========================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ARU HRMS Backend is running 🚀"
    });
});


// =========================
// GET ALL EMPLOYEES
// =========================

app.get("/api/employees", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT employee_id, name, email, phone, department, role, status, joining_date FROM employees"
        );

        res.json({
            success: true,
            employees: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch employees"
        });

    }

});


// =========================
// GET SINGLE EMPLOYEE
// =========================

app.get("/api/employees/:id", async (req, res) => {

    try {

        const [rows] = await db.query(
            "SELECT employee_id, name, email, phone, department, role, status, joining_date FROM employees WHERE employee_id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }

        res.json({
            success: true,
            employee: rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch employee"
        });

    }

});


// =========================
// ADD EMPLOYEE
// =========================

app.post("/api/employees", async (req, res) => {

    try {

        const {
            employee_id,
            name,
            email,
            phone,
            department,
            role,
            status,
            password,
            joining_date
        } = req.body;


        if (
            !employee_id ||
            !name ||
            !email ||
            !department ||
            !role ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });

        }


        const [existing] = await db.query(
            "SELECT employee_id FROM employees WHERE employee_id = ? OR email = ?",
            [employee_id, email]
        );


        if (existing.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Employee ID or email already exists"
            });

        }


        await db.query(
            `INSERT INTO employees
            (employee_id, name, email, phone, department, role, status, password, joining_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                employee_id,
                name,
                email,
                phone || "",
                department,
                role,
                status || "Active",
                password,
                joining_date || null
            ]
        );


        res.status(201).json({
            success: true,
            message: "Employee added successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to add employee"
        });

    }

});


// =========================
// UPDATE EMPLOYEE
// =========================

app.put("/api/employees/:id", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            department,
            role,
            status
        } = req.body;


        const [result] = await db.query(
            `UPDATE employees
             SET name = ?,
                 email = ?,
                 phone = ?,
                 department = ?,
                 role = ?,
                 status = ?
             WHERE employee_id = ?`,
            [
                name,
                email,
                phone,
                department,
                role,
                status,
                req.params.id
            ]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }


        res.json({
            success: true,
            message: "Employee updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to update employee"
        });

    }

});


// =========================
// DELETE EMPLOYEE
// =========================

app.delete("/api/employees/:id", async (req, res) => {

    try {

        const [result] = await db.query(
            "DELETE FROM employees WHERE employee_id = ?",
            [req.params.id]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }


        res.json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to delete employee"
        });

    }

});


// =========================
// REGISTER
// =========================

app.post("/api/register", async (req, res) => {

    try {

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


        const [existing] = await db.query(
            "SELECT employee_id FROM employees WHERE employee_id = ? OR email = ?",
            [employeeId, email]
        );


        if (existing.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Employee already registered"
            });

        }


        await db.query(
            `INSERT INTO employees
            (employee_id, name, email, department, role, password, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                employeeId,
                name,
                email,
                department,
                role,
                password,
                "Active"
            ]
        );


        res.status(201).json({
            success: true,
            message: "Registration successful"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });

    }

});


// =========================
// LOGIN
// =========================

app.post("/api/login", async (req, res) => {

    try {

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


        const [rows] = await db.query(
            `SELECT employee_id, name, email, department, role, status
             FROM employees
             WHERE email = ? AND password = ?`,
            [email, password]
        );


        if (rows.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        res.json({
            success: true,
            message: "Login successful",
            employee: rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });

    }

});


// =========================
// NOTIFICATIONS
// =========================

app.get("/api/notifications/:employeeId", async (req, res) => {

    try {

        const [rows] = await db.query(
            `SELECT *
             FROM notifications
             WHERE employee_id = ?
             ORDER BY created_at DESC`,
            [req.params.employeeId]
        );


        res.json({
            success: true,
            notifications: rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch notifications"
        });

    }

});


// =========================
// SERVER
// =========================

app.listen(PORT, () => {

    console.log(
        `ARU HRMS Backend running on port ${PORT} 🚀`
    );

});