// src/services/kycAdmin.service.js
import { KYCDocument, KYCDocumentHistory, User } from "../db/index.js";
import { logAction } from "../utils/logger.js";

/**
 * List KYC documents pending review
 */
export const listPendingKycDocs = async () => {
  return await KYCDocument.findAll({
    where: { status: "pending" },
    include: [
      {
        model: User,
        attributes: ["id", "email", "phone", "firstName", "lastName"],
      },
    ],
    order: [["submittedAt", "ASC"]],
  });
};

/**
 * Approve a KYC document
 */
export const approveKycDoc = async (documentId, adminId) => {
  const doc = await KYCDocument.findByPk(documentId);
  if (!doc) throw new Error("Document not found");

  await doc.update({ status: "approved" });

  await KYCDocumentHistory.create({
    documentId,
    action: "Approved",
    reason: null,
    triggeredBy: adminId,
  });

  await logAction(adminId, "KYC_APPROVE", { documentId }, null, null);
  return doc;
};

/**
 * Reject a KYC document with reason
 */
export const rejectKycDoc = async (documentId, adminId, reason) => {
  const doc = await KYCDocument.findByPk(documentId);
  if (!doc) throw new Error("Document not found");

  await doc.update({ status: "rejected" });

  await KYCDocumentHistory.create({
    documentId,
    action: "Rejected",
    reason,
    triggeredBy: adminId,
  });

  await logAction(adminId, "KYC_REJECT", { documentId, reason }, null, null);
  return doc;
};
