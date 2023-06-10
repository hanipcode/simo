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

export const createErrorResponse = <T>(error: T): ErrorResponse<T> => ({
  success: false,
  error,
});

export const createSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
});
