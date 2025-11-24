import { title } from "process";
import prisma from "../prisma/prisma.js";


export async function createCategory(req, res) {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const category = await prisma.category.create({
            data: {
                name,
                userId
            }
        })
        return res.json({category});
        
    } catch (error) {
        return res.status(500).json({error: "Server Error"});
    }
}