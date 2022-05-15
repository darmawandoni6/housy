const httpError = require("http-errors");
const response = require("../../helpers/response");
const { create, find, findByid, update, remove } = require("./service");

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
  create: async (req, res, next) => {
    try {
      const { id: userId } = req.payload;
      const {
        name,
        city,
        address,
        pricePerDay,
        pricePerMonth,
        pricePerYear,
        description,
        bedroom,
        bathroom,
        area,
        amenities,
      } = req.body;

      const reqProperty = {
        name,
        city,
        address,
        pricePerDay,
        pricePerMonth,
        pricePerYear,
        description,
        bedroom,
        bathroom,
        area,
        userId,
      };

      const { error } = await create(reqProperty, amenities);
      if (error) throw httpError.BadRequest(error);

      return res.status(200).json(
        response.success({
          message: "create property success",
        })
      );
    } catch (error) {
      next(error);
    }
  },
  find: async (req, res, next) => {
    try {
      const { id } = req.payload;
      console.log(req.payload);
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

      let { data, error } = await find(id, {
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
      const { id: userId } = req.payload;
      const { data, error } = await handleFindById({ id, userId });
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
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.payload;
      let property = { data: null, error: null };
      property = await handleFindById({ id, userId, isStatus: "available" });
      if (property.error) throw property.error;

      const { amenities } = req.body;
      const reqProperty = req.body;
      delete reqProperty.amenities;
      property = await update(id, reqProperty, amenities);
      if (property.error) throw property.error;

      return res.status(200).json(
        response.success({
          message: "success update property",
        })
      );
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.payload;

      let property = { data: null, error: null };
      property = await handleFindById({ id, userId, isStatus: "available" });
      if (property.error) throw property.error;

      property = await remove(id);
      if (property.error) throw httpError.BadRequest(property.error);

      return res.status(200).json(
        response.success({
          message: "delete property success",
        })
      );
    } catch (error) {
      next(error);
    }
  },
};
