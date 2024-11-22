const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const driverRoutes = require("./Routes/register");
const loginRoutes = require("./Routes/login");
// const BulkMessages = require("./Routes/Bulk-Messages")
const dotenv = require("dotenv");
dotenv.config();



const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


  app.use("/", driverRoutes);
  app.use("/", loginRoutes);
  // app.use("/", BulkMessages);


app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
