const app = require("../app");
const auth = require("./auth.route");

const apiV1 = "/api/v1";

app.use(apiV1, auth);
