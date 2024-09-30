// This file interacts with GCS (Google Cloud Storage) files and local files
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";

const storage = new Storage();
const rawVideoBucket = "kloding-raw-yt-videos";
const processedVideoBucket = "kloding-processed-yt-videos";
const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/**
 * Creates local directories for raw and processed videos
 */
export function createDirectories() {}

/**
 * Converts a locally stored video to 720p.
 * @param {string} inputVideoName
 * @param {string} outputVideoName
 * @returns {Promise} - promise that says whether video was successfully processed
 */
export function convertVideo(inputVideoName: string, outputVideoName: string) {
  return new Promise((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${inputVideoName}`)
      .outputOptions("-vf", "scale=-1:720")
      .on("end", () => {
        console.log("Video successfully processed.");
      })
      .on("error", (err) => {
        console.log(`An error occurred: ${err.message}`);
      })
      .save(`${localProcessedVideoPath}/${outputVideoName}`);
  });
}
