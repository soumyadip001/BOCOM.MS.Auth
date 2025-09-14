import { DataTypes } from "sequelize";

export default (sequelize) => {
  const KYCDocumentHistory = sequelize.define(
    "KYCDocumentHistory",
    {
      historyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      documentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(20), // Submitted, Approved, Rejected, Resubmitted
        allowNull: false,
      },
      reason: {
        type: DataTypes.TEXT, // reason for rejection or notes
        allowNull: true,
      },
      triggeredBy: {
        type: DataTypes.INTEGER, // UserID or AdminID
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "kyc_document_history",
      timestamps: false,
    }
  );

  // Associations
  KYCDocumentHistory.associate = (models) => {
    KYCDocumentHistory.belongsTo(models.KYCDocument, {
      foreignKey: "documentId",
      as: "document",
    });
    KYCDocumentHistory.belongsTo(models.User, {
      foreignKey: "triggeredBy",
      as: "actor",
    });
  };

  return KYCDocumentHistory;
};
