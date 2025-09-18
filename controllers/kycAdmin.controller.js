import { successResponse, errorResponse } from "../utils/response.js";
import * as kycAdminService from "../services/kycAdmin.service.js";

export const listPending = async (req, res) => {
  try {
    const docs = await kycAdminService.listPendingKycDocs();
    return successResponse(res, docs, "Pending KYC documents fetched");
  } catch (err) {
    return errorResponse(
      res,
      err.message || "Failed to fetch pending KYC documents",
      500
    );
  }
};

export const approveDoc = async (req, res) => {
  try {
    const { documentId } = req.body;
    const adminId = req.user.id; // from auth middleware
    const doc = await kycAdminService.approveKycDoc(documentId, adminId);
    return successResponse(res, doc, "KYC document approved");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to approve document", 500);
  }
};

export const rejectDoc = async (req, res) => {
  try {
    const { documentId, reason } = req.body;
    const adminId = req.user.id; // from auth middleware
    const doc = await kycAdminService.rejectKycDoc(documentId, adminId, reason);
    return successResponse(res, doc, "KYC document rejected");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to reject document", 500);
  }
};
