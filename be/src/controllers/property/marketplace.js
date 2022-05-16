const httpError = require("http-errors");
const response = require("../../helpers/response");
const { findMarketPlace, findByid } = require("./service");

const handleFindById = async (where) => {
  try {
    const { data, error } = await findByid(where);
    if (error) throw httpError.BadRequest(error);
    if (!data) throw httpError.NotFound();
    return { data };
  } catch (error) {
    return { error };
  }
};
module.exports = {
  find: async (req, res, next) => {
    try {
      let {
        page,
        limit,
        search,
        bedroom,
        bathroom,
        petAllowed,
        furnished,
        sharedAccommodation,
        price,
      } = req.query;

      page = page ? parseInt(page) : 1;
      limit = limit ? parseInt(limit) : 10;
      bedroom = bedroom ? parseInt(bedroom) : "";
      bathroom = bathroom ? parseInt(bathroom) : "";
      price = price ? parseFloat(price) : "";

      let { data, error } = await findMarketPlace({
        page,
        limit,
        search,
        bedroom,
        bathroom,
        petAllowed,
        furnished,
        sharedAccommodation,
        price,
      });

      if (error) throw httpError.BadRequest(error);

      const { rows, count } = data;
      const lastPage = count / limit;
      return res.status(200).json(
        response.success({
          data: rows,
          pagination: response.pagination({
            page,
            limit,
            count,
            lastPage: Math.ceil(lastPage),
          }),
        })
      );
    } catch (error) {
      next(error);
    }
  },
  findByid: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { data, error } = await handleFindById({ id });
      if (error) throw error;

      return res.status(200).json(
        response.success({
          data,
        })
      );
    } catch (error) {
      next(error);
    }
  },
};
