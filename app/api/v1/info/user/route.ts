import { connectDB } from "@/app/lib/connect";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import StudentSchema from "@/app/models/StudentSchema";



export async function GET(req:NextRequest){
    const token = req.cookies.get("cred")?.value;
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    try {
        const { payload } = await jwtVerify(token as string, secret);
        if(!payload.user) return NextResponse.json({success: false, message: "Unauthorized"}, {status: 401});
        await connectDB();
        const user = await StudentSchema.findById(payload.user).select("-passwordHash");
        return NextResponse.json({success: true, user}, {status: 200});
    } catch (error) {
        const err = error instanceof Error ? error.message : "Server unreachable";
        return NextResponse.json({success: false, message: err}, {status: 500})
    }
}