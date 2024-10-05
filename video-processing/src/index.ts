import express from "express";
import ffmpeg from "fluent-ffmpeg";
import { createDirectories } from "./cloud_storage";

const app = express();
app.use(express.json());

createDirectories();

app.post("/process-video", (req, res) => {
  // This gets the path of the input video file from the body of the request
  let data;
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath) {
    res.status(400).send("Bad request: Missing input file path");
    return;
  } else if (!outputFilePath) {
    res.status(400).send("Bad request: Missing output file path");
    return;
  }

  // Convert video to 720p
  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:720")
    .on("end", () => {
      return res.status(200).send("Video successfully processed.");
    })
    .on("error", (err) => {
      console.log(`An error occurred: ${err.message}`);
      res.status(500).send(`Internal Server Error: ${err}`);
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Video processing started at http://localhost:${port}`);
});
