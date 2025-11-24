import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  AllowNull,
  Unique,
  PrimaryKey,
  BelongsToMany
} from "sequelize-typescript";

// Models
import Role from "./RoleModel";
import RolePermission from "./RolePermissionModel";

// Interfaces
interface PermissionAttributes {
  id: string;
  code: string;
  description: string;
}

interface PermissionCreationAttributes extends Optional<PermissionAttributes, "id"> { }

@Table({
  tableName: "permissions"
})
class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare code: string;

  @Column(DataType.STRING)
  declare description: string;

  @BelongsToMany(() => Role, () => RolePermission)
  declare roles: Role[];
}

export default Permission;