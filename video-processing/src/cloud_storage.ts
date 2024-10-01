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
 * @returns {Promise} - promise that is resolved if the video is successfully
 * processed and rejected otherwise
 */
export function convertVideo(
  inputVideoName: string,
  outputVideoName: string
): Promise<any> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${inputVideoName}`)
      .outputOptions("-vf", "scale=-1:720")
      .on("end", () => {
        console.log("Video successfully processed.");
        resolve();
      })
      .on("error", (err) => {
        console.log(`An error occurred: ${err.message}`);
        reject();
      })
      .save(`${localProcessedVideoPath}/${outputVideoName}`);
  });
}

/**
 *
 * @param {string} filename - the filename of the raw video
 * {@link rawVideoBucket} bucket into the {@link localRawVideoPath} folder.
 * @returns {Promise} - promise that is resolved if the video is successfully
 * downloaded and rejected otherwise
 */
export async function downloadRawVideo(filename: string): Promise<any> {
  await storage
    .bucket(rawVideoBucket)
    .file(filename)
    .download({ destination: `${localRawVideoPath}/${filename}` });
  console.log(
    `gs://${rawVideoBucket}/${filename} downloaded to ${localRawVideoPath}/${filename}`
  );
}

/**
 * @param {string} filename = the filename of the processed video
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucket} bucket
 * @returns {Promise} - promise that is resolved if the video is successfully
 * uploaded and rejected otherwise
 */
export async function uploadProcessedVideo(filename: string): Promise<any> {
  const bucket = storage.bucket(processedVideoBucket);
  await bucket.upload(`${localProcessedVideoPath}/${filename}`, {
    destination: filename,
  });
  console.log(
    `${localProcessedVideoPath}/${filename} has been uploaded to
    gs://${processedVideoBucket}/${filename}`
  );
  await bucket.file(filename).makePublic();
}

/**
 * 
 * @param {string} filename - file to be deleted
 * @returns {Promise} - promise that is resolved if the video is successfully deleted
 * or does not exist and is rejected otherwise
 */
function deleteFile(filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filename)) {
      fs.unlink(filename, (err) => {
        if (err) {
          console.log(`${filename} could not be deleted:`);
          console.log(`An error occurred: ${err}`);
          reject(err);
        } else {
            console.log(`${filename} successfully deleted`);
            resolve();
        }
      });
    } else {
      console.log(`${filename} does not exist.`);
      resolve();
    }
  });
}
