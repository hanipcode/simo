interface BaseResponse {
  success: boolean;
}

export type ErrorResponse<T> = BaseResponse & {
  success: false;
  error: T;
};

export type SuccessResponse<T> = BaseResponse & {
  success: true;
  data: T;
};

export const createErrorResponse = <T extends Error>(
  error: T
): ErrorResponse<T> => ({
  success: false,
  error: {
    ...error,
    message: error.message,
    stack: error.stack,
  },
});

export const createSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
});
