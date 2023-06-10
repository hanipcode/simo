export const logError = <T extends Error>(error: T): T => {
  console.log(error);
  return error;
};
