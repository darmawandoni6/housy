import createHttpError from "http-errors";

import authRouter from "@routes/auth";
import propertyRouter from "@routes/property";
import roleRouter from "@routes/role";

import { errorHandler } from "@utils/handleError";
import app from "@utils/server";

import sequelize from "@database/sequelize";

const port = process.env.PORT;

// routes
app.get("/", (req, res) => {
  res.send({
    message: `[Server]: I am running at http://localhost:${port}`,
  });
});
app.use("/", authRouter);

const v1 = "/api-v1";
app.use(v1, roleRouter);
app.use(v1, propertyRouter);

// handling error
app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use(errorHandler);

// listen

(async () => {
  try {
    await sequelize.authenticate();
    // await RoleModel.sync({force: true})
    // await UserModel.sync({force: true})
    // await PropertyModel.sync({ force: true });
    // await TypeOfRentModel.sync({ force: true });
    // await AmenityModel.sync({ force: true });

    app.listen(port, () => {
      console.log(`[Server]: I am running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log(`------------------- ${error} -------------------`);
  }
})();
