import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false },
      roleId: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING(20), defaultValue: "Active" },
      language: { type: DataTypes.STRING(10), defaultValue: "en" }, // 'en'|'fr'
      enabledBiometrics: { type: DataTypes.BOOLEAN, defaultValue: false },

      // Verification fields
      kycStatus: { type: DataTypes.STRING(20), defaultValue: "Pending" }, // 'Pending'|'Approved'|'Rejected'
      kycType: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: "Individual",
      }, // 'Individual'|'Corporate'
      kycVerifiedOn: { type: DataTypes.DATE, allowNull: true },
      isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      isPhoneVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
      phoneVerifiedOn: { type: DataTypes.DATE, allowNull: true },
      emailVerifiedOn: { type: DataTypes.DATE, allowNull: true },

      // Profile fields:
      name: { type: DataTypes.STRING(50) },
      dateOfBirth: { type: DataTypes.DATEONLY, allowNull: true },
      gender: { type: DataTypes.STRING(10), allowNull: true },
      profilePicture: { type: DataTypes.STRING(255) },
      nationalId: { type: DataTypes.STRING(50), allowNull: true },

      // Referral system
      referrerId: { type: DataTypes.INTEGER, allowNull: true },
      referralCode: { type: DataTypes.STRING(20), allowNull: true },

      // Company linking
      companyId: { type: DataTypes.INTEGER, allowNull: true },

      // Address
      addressLine1: { type: DataTypes.STRING(150) },
      addressLine2: { type: DataTypes.STRING(150), allowNull: true },
      city: { type: DataTypes.STRING(50) },
      state: { type: DataTypes.STRING(50) },
      postalCode: { type: DataTypes.STRING(20), allowNull: true },
      country: { type: DataTypes.STRING(50), allowNull: true },

      // Other fields
      createdFrom: { type: DataTypes.STRING(20), defaultValue: "APP" }, // 'APP'|'ADMIN'|'Partner APP'
      registrationStep: { type: DataTypes.STRING(20), defaultValue: "Basic" }, // 'Basic'|'KYC'|'OTP Verify'|'Address'
      lastLoginAt: { type: DataTypes.DATE, allowNull: true },
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
