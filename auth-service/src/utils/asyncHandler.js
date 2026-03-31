const asyncHandler = (execution) => (req, res, next) => {
  execution(req, res, next).catch(next);
};
export default asyncHandler;