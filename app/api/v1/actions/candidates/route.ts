import { connectDB } from "@/lib/connect";
import CandidateSchema from "@/models/CandidateSchema";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams;
  const electionId = param.get("id");
  const token = req.cookies.get("cred")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token as string, secret);
    if (!payload.user && payload.role !== "superadmin")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!electionId)
      return NextResponse.json(
        { success: false, message: "Missing parameter" },
        { status: 400 },
      );
      await connectDB();
      const candidates = await CandidateSchema.find({election: electionId}).populate("student", "name lrnNumber photoUrl").populate("party", "name color logoUrl").populate("position", "title");
      return NextResponse.json({success: true, candidates}, {status: 200});
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
