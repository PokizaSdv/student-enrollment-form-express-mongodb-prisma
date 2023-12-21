import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { prisma } from "./prisma/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
    res.status(200).json("Success");
});

app.post("/students", async (req, res) => {
    const {
        body: { firstName, lastName, email, classEnrolled }
    } = req;

    if (!firstName || !lastName || !email || !classEnrolled) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    try {
        const student = await prisma.student.create({
            data: {
                firstName,
                lastName,
                email,
                classEnrolled
            }
        });
        res.status(201).json({ data: student });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/students", async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            select: {
                firstName: true,
                lastName: true,
                email: true,
                classEnrolled: true
            }
        });
        res.status(200).json({ data: students });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/students/:id", async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const student = await prisma.student.findUnique({
            where: {
                id: id
            },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                classEnrolled: true
            }
        });
        if (!student) {
            res.status(400).json({
                message: "Student with provided id not found"
            });
        }
        res.status(201).json({ data: student });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.patch("/students/:id", async (req, res) => {
    const {
        params: { id },
        body: { input }
    } = req;
    try {
        const student = await prisma.student.findUnique({
            where: {
                id: id
            }
        });

        
        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        
        const updatedStudent = await prisma.student.update({
            where: {
                id: id
            },
            data: {
               firstName: input.firstName || student.firstName,
               lastName: input.lastName || student.lastName,
               email: input.email || student.email,
               classEnrolled: input.classEnrolled || student. classEnrolled
            }
        });
        res.status(203).send({ data: updatedStudent });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete("/students/:id", async (req, res) => {
    const {params: {id}} = req;
    try {
        const student = await prisma.student.findUnique({
            where: {
                id: id
            }
        })
        if(!student) {
            res.status(400).json({message: "Student not found"})
        }
        await prisma.student.delete({
            where: {
                id: id
            }
        })
        res.status(203).send()
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
