const app = require("../app");
const auth = require("./auth.route");
const user = require("./user.route");
const file = require("./file.route");

const apiV1 = "/api/v1";

app.use(apiV1, auth);
app.use(apiV1, user);
app.use(apiV1, file);
