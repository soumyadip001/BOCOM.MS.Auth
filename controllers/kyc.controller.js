import { successResponse, errorResponse } from "../utils/response.js";
import * as kycService from "../services/kyc.service.js";

export const getPresignedUrl = async (req, res) => {
  try {
    const { userId, docType, fileName, contentType, fileSize } = req.body;
    const result = await kycService.getPresignedUrl(
      { userId, docType, fileName, contentType, fileSize },
      req.ip,
      req.headers["user-agent"]
    );
    return successResponse(res, result, "Presigned URL generated");
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to get presigned URL",
      500
    );
  }
};

export const confirmUpload = async (req, res) => {
  try {
    const { userId, docType, docUrl, fileName, contentType, fileSize } =
      req.body;
    const doc = await kycService.confirmUpload(
      { userId, docType, docUrl, fileName, contentType, fileSize },
      req.ip,
      req.headers["user-agent"]
    );
    return successResponse(
      res,
      { kycDocumentId: doc.documentId },
      "KYC document submitted successfully"
    );
  } catch (err) {
    return errorResponse(res, err.message || "Failed to confirm upload", 500);
  }
};

export const resubmitDoc = async (req, res) => {
  try {
    const { userId, documentId, docUrl, fileName, contentType, fileSize } =
      req.body;
    const doc = await kycService.resubmitKycDoc(
      { userId, documentId, docUrl, fileName, contentType, fileSize },
      req.ip,
      req.headers["user-agent"]
    );
    return successResponse(
      res,
      { kycDocumentId: doc.documentId },
      "KYC document resubmitted successfully"
    );
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to resubmit document",
      500
    );
  }
};

export const getMyKycStatus = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const result = await kycService.getUserKycStatus(userId);
    return successResponse(res, result, "KYC status fetched successfully");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch KYC status", 500);
  }
};

