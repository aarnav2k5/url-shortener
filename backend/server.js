// server.js
const express = require("express");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const urlSchema = new mongoose.Schema({
  shortId: String,
  originalUrl: String,
});

const Url = mongoose.model("Url", urlSchema);

// Create short URL
app.post("/shorten", async (req, res) => {
  const { originalUrl } = req.body;
  const shortId = nanoid(6);

  const newUrl = new Url({ shortId, originalUrl });
  await newUrl.save();

  res.json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
});

// Redirect
app.get("/:shortId", async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
