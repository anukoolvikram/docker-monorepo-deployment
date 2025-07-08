import express from "express";
import { prismaClient } from "@repo/db/client";
import { authMiddleware } from "./middleware/auth";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const app=express()
app.use(express.json())

app.post('/signup',async(req,res)=>{
    const {username,password}=req.body;
    const user=await prismaClient.user.create({
        data:{
            username,password
        }
    })
    res.json({
        message:"User created successfully",
        user
    })
})

app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const user=await prismaClient.user.findUnique({
        where:{username,password}
    })
    if(!user){
        res.status(401).json({message:"Invalid username or password"})
        return;
    }
    const token=jwt.sign({userId:user.id},JWT_SECRET)
    res.json({
        message:"User logged in successfully",
        token
    })
})


app.get("/get",authMiddleware, async(req,res)=>{
    //@ts-ignore
    const userId=req.userId;
    const todos=await prismaClient.todo.findMany({
        where:{
            userId
        }
    });
    
    res.json({
        todos
    })
})

app.post("/post",authMiddleware, async(req,res)=>{
    const {task}=req.body;
    // @ts-ignore
    const userId=req.userId;
    const todo=await prismaClient.todo.create({
        data:{
            task,
            userId
        }
    })
    res.json({
        message:"Todo created successfully",
        todo
    })
})

app.listen(3000)