import { connectDB } from "@/lib/connect";
import PartySchema from "@/models/PartySchema";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { electionId, name, color, logoUrl, adminId } = await req.json();
  const token = req.cookies.get("cred")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token as string, secret);
    if (!payload.user && payload.role !== "superadmin")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!electionId || !name || !color || !adminId)
      return NextResponse.json(
        { success: false, message: "Missing parameters" },
        { status: 400 },
      );
    await connectDB();
    const isPartyExist = await PartySchema.findOne({
      name: name,
    });
    if (isPartyExist)
      return NextResponse.json(
        {
          success: false,
          message: `Party ${name.trim().toLowerCase()} already exist`,
        },
        { status: 400 },
      );
    const party = new PartySchema({
      election: electionId,
      name,
      color,
      logoUrl,
      createdBy: adminId,
    });
    await party.save();
    return NextResponse.json(
      {
        success: true,
        message: `Party ${name} created successfully`,
        id: party._id,
      },
      { status: 200 },
    );
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams;
  const token = req.cookies.get("cred")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const id = param.get("election");
  try {
    const { payload } = await jwtVerify(token as string, secret);
    if (!payload.user && payload.role !== "superadmin")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
      await connectDB();
      const parties = await PartySchema.find({election: id});
      if(parties.length <=0 ) return NextResponse.json({success: false, message: "Election doesn't have any parties yet"}, {status: 400})
      return NextResponse.json({success: true, parties}, {status: 200})
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
