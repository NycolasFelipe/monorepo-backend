// Repositories
import BaseRepository from "./BaseRepository";

// Models
import Permission from "../models/PermissionModel";

class PermissionRepository extends BaseRepository<Permission> {
  constructor() {
    super(Permission);
  }
}

export default new PermissionRepository();