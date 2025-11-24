// Repositories
import BaseRepository from "./BaseRepository";

// Models
import Role from "../models/RoleModel";

class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super(Role);
  }
}

export default new RoleRepository();