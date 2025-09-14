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
      addressLine1: { type: DataTypes.STRING(150) },
      city: { type: DataTypes.STRING(50) },
      country: { type: DataTypes.STRING(50) },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "companies",
      timestamps: true,
    }
  );

  return Company;
};
