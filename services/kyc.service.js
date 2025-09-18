// src/services/kyc.service.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { KYCDocument, KYCDocumentHistory, User } from "../db/index.js";
import { logAction } from "../utils/logger.js";

const s3 = new S3Client({ region: process.env.AWS_REGION });

/**
 * Generate S3 Presigned URL for KYC upload
 */
export const getPresignedUrl = async (
  { userId, docType, fileName, contentType, fileSize },
  ip,
  device
) => {
  const s3Key = `kyc/${userId}/${docType}/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const docUrl = `s3://${process.env.S3_BUCKET}/${s3Key}`;

  await logAction(
    userId,
    "KYC_PRESIGN_REQUEST",
    { docType, fileName },
    ip,
    device
  );

  return { uploadUrl, docUrl, expiresIn: 300 };
};

/**
 * Confirm KYC Upload and track history
 */
export const confirmUpload = async (
  { userId, docType, docUrl, fileName, contentType, fileSize },
  ip,
  device
) => {
  // Save new KYC document
  const doc = await KYCDocument.create({
    userId,
    docType,
    mimeType: contentType,
    fileSize,
    docUrl,
    status: "pending",
    submittedAt: new Date(),
  });

  // Add history entry
  await KYCDocumentHistory.create({
    documentId: doc.documentId,
    action: "Submitted",
    reason: null,
    triggeredBy: userId,
  });

  // Update user registration step
  await User.update({ registrationStep: 3 }, { where: { id: userId } });

  await logAction(
    userId,
    "KYC_UPLOAD_CONFIRMED",
    { docType, docUrl },
    ip,
    device
  );

  return doc;
};

export const resubmitKycDoc = async (
  { userId, documentId, docUrl, fileName, contentType, fileSize },
  ip,
  device
) => {
  const doc = await KYCDocument.findByPk(documentId);
  if (!doc) throw new Error("Document not found");

  if (doc.status !== "rejected") {
    throw new Error("Only rejected documents can be resubmitted");
  }

  // Update document
  await doc.update({
    docUrl,
    fileName,
    mimeType: contentType,
    fileSize,
    status: "pending",
    submittedAt: new Date(),
  });

  // Add history entry
  await KYCDocumentHistory.create({
    documentId,
    action: "Resubmitted",
    reason: null,
    triggeredBy: userId,
  });

  await logAction(
    userId,
    "KYC_RESUBMITTED",
    { documentId, docUrl },
    ip,
    device
  );

  return doc;
};

export const getUserKycStatus = async (userId) => {
  const documents = await KYCDocument.findAll({
    where: { userId },
    include: [
      {
        model: KYCDocumentHistory,
        as: "history",
        attributes: ["id", "action", "reason", "triggeredBy", "createdAt"],
        order: [["createdAt", "ASC"]],
      },
    ],
    order: [["submittedAt", "DESC"]],
  });

  // Summarize user KYC status
  let overallStatus = "incomplete";
  if (documents.length > 0) {
    if (documents.every((doc) => doc.status === "approved")) {
      overallStatus = "approved";
    } else if (documents.some((doc) => doc.status === "rejected")) {
      overallStatus = "rejected";
    } else {
      overallStatus = "pending";
    }
  }

  return { overallStatus, documents };
};
