const express = require("express");
const app = express();
const cors = require("cors");
require("./connection/conn");
const auth = require("./routes/auth");
const list = require("./routes/list");

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' }));

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1", auth);
app.use("/api/v2", list);

app.listen(3000, () => {
  console.log("Server started");
});

