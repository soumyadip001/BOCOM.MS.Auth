import { DataTypes } from "sequelize";

export default (sequelize) => {
  const NotificationLog = sequelize.define(
    "NotificationLog",
    {
      notificationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      channel: {
        type: DataTypes.STRING(20), // 'sms' | 'email' | 'push'
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20), // 'sent' | 'failed' | 'pending' | 'otp_failed'
        defaultValue: "pending",
      },
      snsMessageId: {
        type: DataTypes.STRING(100), // AWS SNS message ID
        allowNull: true,
      },
      errorMessage: {
        type: DataTypes.TEXT, // store failure reason if any
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deliveredAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "notification_logs",
      timestamps: false,
    }
  );

  NotificationLog.associate = (models) => {
    NotificationLog.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return NotificationLog;
};
