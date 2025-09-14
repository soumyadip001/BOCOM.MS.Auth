import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Company = sequelize.define(
    "Company",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      companyName: { type: DataTypes.STRING(150), allowNull: false },
      registrationNumber: { type: DataTypes.STRING(50) },
      taxId: { type: DataTypes.STRING(50) },
      contactEmail: { type: DataTypes.STRING(100) },
      contactPhone: { type: DataTypes.STRING(20) },
      addressLine1: { type: DataTypes.STRING(150), allowNull: true },
      addressLine2: { type: DataTypes.STRING(150), allowNull: true },
      city: { type: DataTypes.STRING(50), allowNull: true },
      country: { type: DataTypes.STRING(50), allowNull: true },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      verificationStatus: {
        type: DataTypes.STRING(50),
        defaultValue: "Pending",
      }, // 'Pending'|'Approved'|'Rejected'
      verifiedOn: { type: DataTypes.DATE, allowNull: true },
      verifiedBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "companies",
      timestamps: true,
    }
  );

  return Company;
};
