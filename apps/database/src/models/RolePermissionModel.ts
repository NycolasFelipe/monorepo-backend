import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  AllowNull,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

// Models
import Role from "./RoleModel";
import Permission from "./PermissionModel";

// Interfaces
interface RolePermissionAttributes {
  role_id: string;
  permission_id: string;
}

interface RolePermissionCreationAttributes extends Optional<RolePermissionAttributes, never> { }

@Table({
  tableName: "roles_permissions"
})
class RolePermission extends Model<RolePermissionAttributes, RolePermissionCreationAttributes> {
  @PrimaryKey
  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare role_id: string;

  @PrimaryKey
  @ForeignKey(() => Permission)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare permission_id: string;

  @BelongsTo(() => Role)
  declare role: Role;

  @BelongsTo(() => Permission)
  declare permission: Permission;
}

export default RolePermission;