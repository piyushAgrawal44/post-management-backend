export const isInValidateField = (arr, obj) => {
  const inValidate = arr.find((a) => {
    if (!obj[a.key]) {
      return (a.message = `${a.key} is required`);
    } else if (
      obj[a.key] &&
      a.pattern &&
      !new RegExp(a.pattern).test(obj[a.key])
    ) {
      return (a.message = a?.message ? a?.message : `Enter correct ${a.key}`);
    }
  });

  return inValidate?.message || false;
};

export const sendResponse = (res, status = 200, message, data) => {
  return res.status(status).json({ message, ...data });
};

export const createPaginationAndSearch = async (
  req,
  model,
  select,
  populate,
  filterOpt
) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const query = filterOpt ? { ...filterOpt } : {};

  if (search) {
    query.$or = [];
    Object.keys(model.schema.paths).forEach((path) => {
      if (model.schema.paths[path].instance === "String") {
        query.$or.push({ [path]: { $regex: search, $options: "i" } });
      }
    });
  }

  const results = await model
    .find(query)
    .select(select)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate(populate)
    .sort({ createdAt: -1 })
    .exec();

  const count = await model.countDocuments(query);

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    results,
  };
};
