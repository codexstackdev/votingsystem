import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/connect";
import StudentSchema from "@/app/models/StudentSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { lrnNumber, password } = await req.json();
  try {
    if (!lrnNumber || !password)
      return NextResponse.json(
        { sucess: false, message: "Missing credentials" },
        { status: 400 },
      );
    await connectDB();
    const user = await StudentSchema.findOne({ lrnNumber: lrnNumber });
    if (!user)
      return NextResponse.json(
        { success: false, message: "Student doesn't exist" },
        { status: 400 },
      );
    const checkPassword = await bcrypt.compare(password, user.passwordHash);
    if (!checkPassword)
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 },
      );
    const token = jwt.sign(
      { user: user._id },
      process.env.SECRET_KEY as string,
      { expiresIn: "1d" },
    );
    const response = NextResponse.json({
      success: true,
      message: `Welcome ${user.name}`,
    }, {status: 200});
    response.cookies.set({
      name: "cred",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
