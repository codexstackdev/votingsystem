import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/connect";
import ElectionSchema from "@/app/models/ElectionSchema";
import { jwtVerify } from "jose";

export async function POST(req: NextRequest) {
  const { title, description, startAt, endAt, action } = await req.json();
  const token = req.cookies.get("cred")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token as string, secret);
    if (!payload.user && payload.role !== "superadmin")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (action === "create") {
      if (!title || !description || !startAt || !endAt)
        return NextResponse.json(
          { success: false, message: "Missing parameters" },
          { status: 400 },
        );
      await connectDB();
      const election = new ElectionSchema({
        title,
        description,
        startAt,
        endAt,
        createdBy: payload.user,
      });
      await election.save();
      return NextResponse.json(
        {
          success: true,
          message: "Election created successfully",
          id: election._id,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
