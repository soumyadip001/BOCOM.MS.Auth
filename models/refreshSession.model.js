import { DataTypes } from "sequelize";

export default (sequelize) => {
  const RefreshSession = sequelize.define(
    "RefreshSession",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      refreshToken: { type: DataTypes.STRING(500), allowNull: false },
      ipAddress: { type: DataTypes.STRING(50), allowNull: true },
      device: { type: DataTypes.STRING(200), allowNull: true },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      lastUsedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "refresh_sessions", timestamps: true }
  );

  return RefreshSession;
};
