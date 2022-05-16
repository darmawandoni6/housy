const app = require("../app");
const auth = require("./auth.route");
const user = require("./user.route");
const file = require("./file.route");
const propertyAdmin = require("./property/admin.route");
const propertyMarketPlace = require("./property/marketplace.route");
const propertyImage = require("./propertyImage.route");
const booking = require("./booking.route");

const apiV1 = "/api/v1";
const admin = apiV1 + "/admin";
const marketplace = apiV1 + "/marketplace";

app.use(apiV1, auth);

// all
app.use(apiV1, user);
app.use(apiV1, file);

//admin
app.use(admin, propertyAdmin);
app.use(admin, propertyImage);

//marketplace
app.use(marketplace, propertyMarketPlace);
app.use(marketplace, booking);
