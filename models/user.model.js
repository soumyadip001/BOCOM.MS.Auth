import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.STRING(50), allowNull: false }, // 'Individual'|'CorporateAdmin'|'Employee'
      status: { type: DataTypes.STRING(20), defaultValue: "Active" },
      isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      isPhoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },

      // Profile fields:
      firstName: { type: DataTypes.STRING(50) },
      lastName: { type: DataTypes.STRING(50) },
      dateOfBirth: { type: DataTypes.DATEONLY },
      gender: { type: DataTypes.STRING(10) },
      profilePicture: { type: DataTypes.STRING(255) },

      // Company linking
      companyId: { type: DataTypes.INTEGER, allowNull: true },

      // Address
      addressLine1: { type: DataTypes.STRING(150) },
      addressLine2: { type: DataTypes.STRING(150) },
      city: { type: DataTypes.STRING(50) },
      state: { type: DataTypes.STRING(50) },
      postalCode: { type: DataTypes.STRING(20) },
      country: { type: DataTypes.STRING(50) },

      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
