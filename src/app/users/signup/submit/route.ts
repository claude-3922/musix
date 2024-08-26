import Users from "@/app/models/Users";
import { generateRandomString } from "@/util/random";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.MONGO_DB_URI) {
    console.log(
      "INFO /users/signup/submit 'No MongoDB URI was found in environment variables'"
    );
    return NextResponse.json(
      { message: "No MongoDB URI was found in environment variables" },
      { status: 500 }
    );
  }

  let dbConnection = await mongoose.connect(process.env.MONGO_DB_URI);

  if (!dbConnection) {
    console.log(
      "INFO /users/signup/submit 'Error occured while connecting to database'"
    );
    return NextResponse.json(
      { message: "Error occured while connecting to database" },
      { status: 500 }
    );
  }

  let body;

  try {
    const reqData = await req.json();
    body = reqData;
  } catch (err) {
    dbConnection.disconnect().catch(console.log);
    return NextResponse.json(
      { message: `Request body invalid.` },
      { status: 403 }
    );
  }

  if (!body.username || !body.password) {
    dbConnection.disconnect().catch(console.log);
    return NextResponse.json(
      { message: `Either username or password is missing.` },
      { status: 403 }
    );
  }

  const found = await Users.exists({ username: body.username });
  if (found) {
    dbConnection.disconnect().catch(console.log);
    return NextResponse.json(
      { message: `Account with username '${body.username}' already exists.` },
      { status: 404 }
    );
  }

  await Users.create({
    username: body.username,
    password: body.password,
  });

  dbConnection.disconnect().catch(console.log);
  return NextResponse.json(
    { message: "Account creation successful." },
    { status: 200 }
  );
}
