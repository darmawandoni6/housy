module.exports = {
  success: (message, data, pagination) => {
    return {
      message: message ?? "success",
      code: 200,
      data: data ?? null,
      pagination,
    };
  },
  error: (message, code) => {
    return {
      message: message ?? "success",
      code,
      data: null,
    };
  },
  pagination: ({ page = 1, limit = 0, count = 0, lastPage = 1 }) => {
    return {
      page,
      limit,
      count,
      lastPage,
    };
  },
};
