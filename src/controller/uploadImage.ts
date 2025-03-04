import dotenv from "dotenv";import { Request, Response } from "express";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

dotenv.config();
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error("AWS_REGION and AWS_ACCESS_ KEY must be specified");
}

const s3uploadImageFile = async (fileBuffer: Buffer, fileName: string) => {
  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  const params = {
    Bucket: bucketName,
    Key: `images/${Date.now().toString()}_${fileName}`,
    Body: fileBuffer,
  };

  try {
    const uploadParallel = new Upload({
      client: s3Client,
      queueSize: 4,
      partSize: 5 * 1024 * 1024,
      leavePartsOnError: false,
      params,
    });

    const result = await uploadParallel.done();
    if (result) return result.Location;
  } catch (e) {
    console.log(e);
  }
};


export const imageUploadToS3 = async (req: Request, res: Response) => {
    try {
      const file = req.file;      
      if (!file) {
        res.status(400).json({ message: "failed to get file" });
        return;
      }
  
      const uploadResponse = await s3uploadImageFile(
        file.buffer,
        file.originalname
      );
      if (uploadResponse) {
        res.status(200).json({ message: "success", link: uploadResponse });
      } else {
        res.status(400).json({ message: "failed" });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "failed" });
    }
  };