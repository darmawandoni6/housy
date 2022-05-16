require("dotenv").config();
const httpError = require("http-errors");
const app = require("./src/app");
const database = require("./src/configs/mysql");
const response = require("./src/helpers/response");
const Amenities = require("./src/models/amenities.model");
const Booking = require("./src/models/booking.model");
const Files = require("./src/models/file.mode");
const Property = require("./src/models/property.model");
const PropertyImage = require("./src/models/propertyImage.model");
const Transaction = require("./src/models/transaction.model");
const Users = require("./src/models/user.model");

app.get("/", (req, res) => {
  res.status(200).json(response.success());
});

(async () => {
  try {
    await database.authenticate();
    console.log("Database Connected ....");
    // console.log("alter table ----------------------------------------");
    // await Files.sync({ alter: true });
    // await Users.sync({ alter: true });
    // await Property.sync({ alter: true });
    // await Amenities.sync({ alter: true });
    // await PropertyImage.sync({ alter: true });
    // await Booking.sync({ alter: true });
    // await Transaction.sync({ alter: true });
    // console.log("alter table done ----------------------------------------");
  } catch (error) {
    console.log(" ---------------------------");
    console.error(error.message);
    console.log(" ---------------------------");
    process.exit();
  }
})();

require("./src/routes");

app.use("*", (req, res, next) => {
  console.log(req.baseUrl);
  next(httpError.MethodNotAllowed());
});

app.use((err, req, res, next) => {
  const code = err.status || 500;
  res.status(code);
  res.json(response.error(err.message, code));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
