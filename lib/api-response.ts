import { NextResponse } from "next/server";

export class ApiResponse {
  static success<T>(data: T, status: number = 200) {
    return NextResponse.json({ success: true, data }, { status });
  }

  static error(message: string, status: number = 400, errors: any[] = []) {
    return NextResponse.json(
      { success: false, message, errors },
      { status }
    );
  }

  static paginate<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    status: number = 200
  ) {
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }, { status });
  }
}