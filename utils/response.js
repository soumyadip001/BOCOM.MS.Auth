export const successResponse = (res, data, message = "Success") => {
  return res.status(200).json({ success: true, message, data });
};

export const errorResponse = (
  res,
  message = "Error",
  code = 400,
  details = null
) => {
  return res.status(code).json({ success: false, message, details });
};
