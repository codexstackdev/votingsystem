import { connectDB } from "@/lib/connect";
import StudentSchema from "@/models/StudentSchema";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const query = params.get("q");
  const type = params.get("t");
  const token = req.cookies.get("cred")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token as string, secret);
    if (!payload.user && payload.role !== "superadmin")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!query || !type)
      return NextResponse.json(
        { success: false, message: "Invalid params" },
        { status: 400 },
      );
    if (type === "student") {
      await connectDB();
      const students = await StudentSchema.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { studentNumber: { $regex: query, $options: "i" } },
        ],
      })
        .select("name lrnNumber photoUrl")
        .limit(10);
        return NextResponse.json({success: true, students}, {status: 200})
    }
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
