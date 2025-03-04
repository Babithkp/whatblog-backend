"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUploadToS3 = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
dotenv_1.default.config();
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;
if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error("AWS_REGION and AWS_ACCESS_ KEY must be specified");
}
const s3uploadImageFile = (fileBuffer, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const s3Client = new client_s3_1.S3Client({
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
        const uploadParallel = new lib_storage_1.Upload({
            client: s3Client,
            queueSize: 4,
            partSize: 5 * 1024 * 1024,
            leavePartsOnError: false,
            params,
        });
        const result = yield uploadParallel.done();
        if (result)
            return result.Location;
    }
    catch (e) {
        console.log(e);
    }
});
const imageUploadToS3 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "failed to get file" });
            return;
        }
        const uploadResponse = yield s3uploadImageFile(file.buffer, file.originalname);
        if (uploadResponse) {
            res.status(200).json({ message: "success", link: uploadResponse });
        }
        else {
            res.status(400).json({ message: "failed" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: "failed" });
    }
});
exports.imageUploadToS3 = imageUploadToS3;
