"use server";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await fetch(`${process.env.RAG_DEV_URL}/llama/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: body.question }),
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: `Backend returned ${result.status}` },
        { status: result.status },
      );
    }

    return new Response(result.body, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
