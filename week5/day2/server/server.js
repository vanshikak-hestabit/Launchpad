const express = require("express");
const mongoose = require("mongoose");
const Feedback = require("./models/Feedback");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/mydb")
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error(err));

app.post("/api/feedback", async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    console.log(feedback);
     return res.json({ success: true, data: feedback });
     
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/feedback", async (req, res) => {
  try {
    const allFeedback = await Feedback.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: allFeedback });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(5000, () => console.log("Server running"));
