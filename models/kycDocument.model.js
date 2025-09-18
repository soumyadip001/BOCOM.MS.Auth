import { DataTypes } from "sequelize";

export default (sequelize) => {
  const KYCDocument = sequelize.define(
    "KYCDocument",
    {
      documentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      docType: {
        type: DataTypes.STRING(50),
        allowNull: false, // e.g. Passport, ID, CompanyRegCert
      },
      mimeType: { type: DataTypes.STRING(100) },
      fileSize: { type: DataTypes.INTEGER },
      docUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "pending", // uploaded | pending | approved | rejected
      },
      submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      lastReviewedBy: {
        type: DataTypes.INTEGER, // Admin UserID who last reviewed
        allowNull: true,
      },
      reviewedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "kyc_documents",
      timestamps: false,
    }
  );

  // Associations
  KYCDocument.associate = (models) => {
    KYCDocument.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return KYCDocument;
};
