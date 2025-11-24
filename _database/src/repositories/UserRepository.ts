// Repositories
import BaseRepository from "./BaseRepository";

// Models
import User from "../models/UserModel";

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }
}

export default new UserRepository();