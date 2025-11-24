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
import User from "./UserModel";
import Role from "./RoleModel";

// Interfaces
interface UserRoleAttributes {
  user_id: string;
  role_id: string;
}

interface UserRoleCreationAttributes extends Optional<UserRoleAttributes, never> { }

@Table({
  tableName: "users_roles"
})
class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> {
  @PrimaryKey
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare user_id: string;

  @PrimaryKey
  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare role_id: string;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Role)
  declare role: Role;
}

export default UserRole