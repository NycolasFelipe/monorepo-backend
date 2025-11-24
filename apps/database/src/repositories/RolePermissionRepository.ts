// Repositories
import BaseRepository from "./BaseRepository";

// Models
import RolePermission from "../models/RolePermissionModel";

class RolePermissionRepository extends BaseRepository<RolePermission> {
  constructor() {
    super(RolePermission);
  }
}

export default new RolePermissionRepository();