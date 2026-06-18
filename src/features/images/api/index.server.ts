import { S3Client } from "@aws-sdk/client-s3";


export const s3Client = new S3Client({
    endpoint: "http://localhost:3900", // Your Garage endpoint
    region: "garage",                  // Default region string for Garage
    credentials: {
        accessKeyId: "change-me",     // Generated via `garage key create`
        secretAccessKey: "change-me-in-garage", // Generated via `garage key create`
    },
    forcePathStyle: true, // REQUIRED: Garage uses path-style addressing by default
});