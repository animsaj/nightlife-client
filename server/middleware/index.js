var mongoose = require("mongoose");
var barSchema = require("../models/bar");

module.exports = {
  connectDisconnect: (req, res, next) => {
    var connection = mongoose.createConnection(
      req.webtaskContext.secrets.MONGO_URL
    );
    req.barModel = connection.model("Bar", barSchema);
    req.on("end", () => {
      mongoose.connection.close();
    });
    next();
  }
};
