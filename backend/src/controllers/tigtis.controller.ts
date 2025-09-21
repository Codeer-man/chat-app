import { Request, Response } from "express";
import { throwError } from "../lib/utils";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { tirgirs } from "../lib/s3";

export const generatePresignedURL = async (req: Request, res: Response) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      throwError("file name or it's type is missing", 401);
    }

    const key = `uploads/${Date.now}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.TIGRIS_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const uploadURL = await getSignedUrl(tirgirs, command);

    const fileUrl = `https://${
      process.env.TIGRIS_BUCKET_NAME
    }.${process.env.TIGRIS_STORAGE_ENDPOINT?.replace(
      /^https?:\/\//,
      ""
    )}/${key}`;

    res.status(201).json({ uploadURL, fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json("Invalid server error");
    return;
  }
};
