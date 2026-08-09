import { connectDB } from "@/lib/connect";
import PositionSchema from "@/models/PositionSchema";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){
    try {
        
    } catch (error) {
        const err = error instanceof Error ? error.message : "Server Unreachable";
        return NextResponse.json({success: false, message: err}, {status: 500})
    }
}