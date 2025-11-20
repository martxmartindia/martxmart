export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public errors: any[] = []
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(msg: string, errors: any[] = []) {
    return new ApiError(msg, 400, errors);
  }

  static unauthorized(msg: string = 'Unauthorized') {
    return new ApiError(msg, 401);
  }

  static forbidden(msg: string = 'Forbidden') {
    return new ApiError(msg, 403);
  }

  static notFound(msg: string = 'Resource not found') {
    return new ApiError(msg, 404);
  }

  static internal(msg: string = 'Internal server error') {
    return new ApiError(msg, 500);
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    return Response.json(
      { message: error.message, errors: error.errors },
      { status: error.statusCode }
    );
  }

  console.error('Unhandled error:', error);
  
  // Handle Prisma database connection errors
  if (error instanceof Error && error.message.includes('Can\'t reach database server')) {
    return Response.json(
      { message: 'Database connection error. Please try again later.' },
      { status: 503 }
    );
  }

  return Response.json(
    { message: 'Internal server error' },
    { status: 500 }
  );
};