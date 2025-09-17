import { DataTypes } from "sequelize";

export default (sequelize) => {
  const OtpCode = sequelize.define(
    "OtpCode",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: true }, // before final user creation it can be null
      phone: { type: DataTypes.STRING(20), allowNull: false },
      otpHash: { type: DataTypes.STRING(255), allowNull: false },
      purpose: { type: DataTypes.STRING(50), allowNull: false }, // registration, login, password_reset
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      used: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "otp_codes",
      timestamps: true,
    }
  );

  return OtpCode;
};
