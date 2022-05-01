import { IUser } from './../models/user.model'

export default class UserService {
  static async register(user: IUser) {
    // TODO
  }

  static async login(email: string, password: string) {
    // TODO
  }

  static async getAll() {
    // TODO
  }

  static async get(id: string) {
    // TODO
  }

  static async requestFriend(requesterId: string, requestedId: string) {
    // TODO
  }

  static async acceptFriend(accepterId: string, acceptedId: string) {
    // TODO
  }

  static async rejectFriend(rejecterId: string, rejectedId: string) {
    // TODO
  }

  static async removeFriend(removerId: string, removedId: string) {
    // TODO
  }
}
