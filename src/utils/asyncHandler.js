const asyncHandler = func => async (req, res, next) => {
  try {
    return await func(req, res, next);
  } catch (error) {
    return res.status(error.code || 500).json({
      success: false,
      message: error.message,
    });
    console.log("Error:", error);
  }
};

export default asyncHandler;

//the upper code canbe done with promise

// const asyncHandler = reqHandler => {
//   (req, res, next) => {
//     Promise.resolve(reqHandler(req, res, next)).catch(e => next(e));
//   };
// };
