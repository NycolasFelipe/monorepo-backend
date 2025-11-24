// Repositories
import BaseRepository from "./BaseRepository";

// Models
import UserRole from "../models/UserRoleModel";

class UserRoleRepository extends BaseRepository<UserRole> {
  constructor() {
    super(UserRole);
  }
}

export default new UserRoleRepository();