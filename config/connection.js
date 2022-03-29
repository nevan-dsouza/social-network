const mongoose = require("mongoose");

// Wrap Mongoose around local connection to MongoDB
mongoose.connect("mongodb://localhost:27017/socialnetworkDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Export the connection file
module.exports = mongoose.connection;
