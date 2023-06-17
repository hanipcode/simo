import * as R from "fp-ts/Record";
const sanitizedField = ["password"] as const;

export const sanitizeUser = () =>
  R.filterWithIndex((i) => !sanitizedField.includes(i as any));
