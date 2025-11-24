import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  AllowNull,
  PrimaryKey,
  BelongsToMany
} from "sequelize-typescript";

// Models
import Permission from "./PermissionModel";
import RolePermission from "./RolePermissionModel";
import User from "./UserModel";
import UserRole from "./UserRoleModel";

// Interfaces
interface RoleAttributes {
  id: string;
  name: string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> { }

@Table({
  tableName: "roles"
})
class Role extends Model<RoleAttributes, RoleCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @BelongsToMany(() => User, () => UserRole)
  declare users: User[];

  @BelongsToMany(() => Permission, () => RolePermission)
  declare permissions: Permission[];
}

export default Role;