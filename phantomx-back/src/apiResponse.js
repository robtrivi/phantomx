function sendSuccess(res, statusCode, message, data) {
  const payload = {
    code: statusCode,
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(payload);
}

function sendSuccessRows(res, statusCode, message, rows, totalRows) {
  const data = {
    rows,
    totalRows,
  };

  const payload = {
    code: statusCode,
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(payload);
}

function sendError(res, statusCode, message, errorData) {
  const asArray =
    errorData === undefined
      ? []
      : Array.isArray(errorData)
      ? errorData
      : [errorData];

  const payload = {
    code: statusCode,
    success: false,
    message,
    errorData: asArray,
  };

  return res.status(statusCode).json(payload);
}

module.exports = {
  sendSuccess,
  sendSuccessRows,
  sendError,
};
