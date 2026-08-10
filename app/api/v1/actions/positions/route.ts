import { connectDB } from "@/lib/connect";
import ElectionSchema from "@/models/ElectionSchema";
import PositionSchema from "@/models/PositionSchema";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const param = req.nextUrl.searchParams;
  const id = param.get("election");
  const token = req.cookies.get("cred")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token as string, secret);
    if (!payload.user && payload.role !== "superadmin")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!id)
      return NextResponse.json(
        { success: false, message: "Missing parameter" },
        { status: 400 },
      );
    await connectDB();
    const positions = await PositionSchema.find({ election: id })
      .sort({
        order: 1,
      })
      .select("-updatedAt -createdAt");

    if (positions.length === 0)
      return NextResponse.json(
        { success: false, message: "Election doesn't have any positions yet" },
        { status: 400 },
      );
    return NextResponse.json({ success: true, positions }, { status: 200 });
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { electionId, title, order, maxVotes } = await req.json();
  const token = req.cookies.get("cred")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token as string, secret);
    if (!payload.user && payload.role !== "superadmin")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!electionId || !title || !order || !maxVotes)
      return NextResponse.json(
        { success: false, message: "Missing parameter" },
        { status: 400 },
      );
    await connectDB();
    const isElectionExist = await ElectionSchema.findById(electionId);
    if (!isElectionExist)
      return NextResponse.json(
        { success: false, message: "Election doesn't exist" },
        { status: 400 },
      );
    const position = new PositionSchema({
      election: electionId,
      title,
      order,
      maxVotes,
    });
    await position.save();
    return NextResponse.json(
      {
        success: true,
        message: `${title} created successfully`,
        id: position._id,
      },
      { status: 200 },
    );
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const id = params.get("id");
  const token = req.cookies.get("cred")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token as string, secret);
    if (!payload.user && payload.role !== "superadmin")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!id)
      return NextResponse.json(
        { success: false, message: "Missing parameter" },
        { status: 400 },
      );
    await connectDB();
    const position = await PositionSchema.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, message: "Position deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { electionId, title, order, maxVotes } = await req.json();
  const token = req.cookies.get("cred")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token as string, secret);
    if (!payload.user && payload.role !== "superadmin")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    await connectDB();
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (order !== undefined) updateData.order = order;
    if (maxVotes !== undefined) updateData.maxVotes = maxVotes;
    const position = await PositionSchema.findByIdAndUpdate(
      electionId,
      {
        $set: { updateData },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    return NextResponse.json({success: true, message: "Position updated successfully"}, {status: 200});
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
