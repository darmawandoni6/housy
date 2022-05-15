const app = require("../app");
const auth = require("./auth.route");
const user = require("./user.route");
const file = require("./file.route");
const property = require("./property.route");
const jwt = require("../helpers/jwt");

const apiV1 = "/api/v1";

const admin = apiV1 + "/admin";

// all
app.use(apiV1, auth);
app.use(apiV1, jwt.verifyAccessToken, user);
app.use(apiV1, jwt.verifyAccessToken, file);

//admin
app.use(admin, jwt.verifyAccessToken, property);
