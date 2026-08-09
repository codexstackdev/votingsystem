import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connect";
import Studentschema from "@/models/StudentSchema";
import bcrypt from "bcryptjs";

export async function POST(req:NextRequest){
    const { lrnNumber, name, email, password, course, gradeLevel } = await req.json();
    try {
        if(!lrnNumber || !name || !email || !password || !course || !gradeLevel) return NextResponse.json({success: false, message: "Missing Credentials"}, {status: 400});
        await connectDB();
        const isEmailExist = await Studentschema.findOne({email: email});
        const isStudentExist = await Studentschema.findOne({lrnNumber: lrnNumber});
        if(isEmailExist || isStudentExist) return NextResponse.json({success: false, message: "Student already registered"}, {status: 400});
        const passwordHash = await bcrypt.hash(password, 10);
        const newStudent = new Studentschema({lrnNumber, name, email, passwordHash, course, gradeLevel});
        await newStudent.save();
        return NextResponse.json({success: true, message: "registered successfully"}, {status: 200})
    } catch (error) {
        const err = error instanceof Error ? error.message : "Server Unreachable";
        return NextResponse.json({success: false, message: err}, {status: 500});
    }
}