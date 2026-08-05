import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/connect";
import ElectionSchema from "@/app/models/ElectionSchema";
import { jwtVerify } from "jose";

export async function POST(req: NextRequest) {
  const { id, status, title, description, startAt, endAt, action } =
    await req.json();
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
    } else if (action === "update") {
      if (!id || !status)
        return NextResponse.json(
          { success: false, message: "Missing parameters" },
          { status: 400 },
        );
      await connectDB();
      const updateElection = await ElectionSchema.findByIdAndUpdate(
        id,
        {
          $set: { isActivated: status },
        },
        { new: true },
      );
      return NextResponse.json(
        { success: true, message: "Election activated" },
        { status: 200 },
      );
    } else if (action === "end") {
      if (!id)
        return NextResponse.json(
          { success: false, message: "Missing parameters" },
          { status: 400 },
        );
      await connectDB();
      const updateElection = await ElectionSchema.findByIdAndUpdate(
        id,
        {
          $set: { endAt: new Date() },
        },
        { new: true },
      );
      return NextResponse.json(
        { success: true, message: "Election Ended" },
        { status: 200 },
      );
    }
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("cred")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  try {
    const { payload } = await jwtVerify(token as string, secret);
    if (!payload.user || payload.role !== "superadmin")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    await connectDB();
    const election = await ElectionSchema.find({});
    return NextResponse.json({ success: true, election });
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
    if (!payload.user || payload.role !== "superadmin")
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
    const election = await ElectionSchema.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, message: "Election deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { id, title, description, startAt, endAt } = await req.json();

  const token = req.cookies.get("cred")?.value;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);

  try {
    const { payload } = await jwtVerify(token as string, secret);

    if (!payload.user || payload.role !== "superadmin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing election id" },
        { status: 400 },
      );
    }

    await connectDB();

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startAt !== undefined) updateData.startAt = startAt;
    if (endAt !== undefined) updateData.endAt = endAt;

    const updatedElection = await ElectionSchema.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Election updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Unreachable";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
