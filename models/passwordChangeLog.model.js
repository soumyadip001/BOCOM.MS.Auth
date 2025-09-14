import { DataTypes } from "sequelize";

export default (sequelize) => {
  const PasswordChangeLog = sequelize.define(
    "PasswordChangeLog",
    {
      logId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      oldPasswordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      newPasswordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      changeType: {
        type: DataTypes.STRING(20), // 'manual_change' | 'admin_reset' | 'forgot_password'
        allowNull: false,
      },
      changedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      ipAddress: {
        type: DataTypes.STRING(45), // track where change was made
        allowNull: true,
      },
      device: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      browser: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      operatingSystem: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: "password_change_logs",
      timestamps: false,
    }
  );

  PasswordChangeLog.associate = (models) => {
    PasswordChangeLog.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return PasswordChangeLog;
};
