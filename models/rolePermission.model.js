import { DataTypes } from "sequelize";

export default (sequelize) => {
  const RolePermission = sequelize.define(
    "RolePermission",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "role_permissions",
      timestamps: false,
    }
  );

  return RolePermission;
};
