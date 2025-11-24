import { Optional } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  AllowNull,
  Unique,
  IsEmail,
  PrimaryKey,
  BelongsToMany
} from "sequelize-typescript";

// Models
import Role from "./RoleModel";
import UserRole from "./UserRoleModel";

// Enums
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

// Interfaces
interface UserAttributes {
  id: string;
  fullname: string;
  email: string;
  email_verified: boolean;
  password_hashed: string;
  cpf: string;
  phone: string;
  phone_verified: boolean;
  birth_date: Date;
  gender: Gender;
  avatar_url: string;
  last_login: Date;
  failed_login_attempts: number;
  is_active: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }

@Table({
  tableName: "users"
})
class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare fullname: string;

  @AllowNull(false)
  @Unique
  @IsEmail
  @Column(DataType.STRING)
  declare email: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare email_verified: boolean;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password_hashed: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare cpf: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare phone: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare phone_verified: boolean;

  @Column(DataType.DATE)
  declare birth_date: Date;

  @Column(DataType.ENUM(...Object.values(Gender)))
  declare gender: Gender;

  @Column(DataType.TEXT)
  declare avatar_url: string;

  @Column(DataType.DATE)
  declare last_login: Date;

  @Default(0)
  @Column(DataType.INTEGER)
  declare failed_login_attempts: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_active: boolean;

  @BelongsToMany(() => Role, () => UserRole)
  declare roles: Role[];
}

export default User;