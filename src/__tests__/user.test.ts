import _ from 'lodash'
import { Types } from 'mongoose'
import request from 'supertest'

import app from '../app'
import UserModel from '../models/user.model'
import { signAccessToken, signRefreshToken } from './../utils/jwt'
import { ITestUser } from './utils/factories'
import { userPayload } from './utils/payloads'
import { seedDB } from './utils/seedDB'
import { connectTestingDB, disconnectTestingDB } from './utils/testingDB'

const api = request(app)

describe('User API tests', () => {
  let users: ITestUser[]
  let user: ITestUser
  let i = 0

  beforeAll(async () => {
    await connectTestingDB()
    const db = await seedDB()
    users = db.users
    user = users[0]
  })

  afterAll(async () => {
    await disconnectTestingDB()
  })

  describe('POST /users/register', () => {
    describe('given the user data is valid', () => {
      it('should return registered user data', async () => {
        const { status, body } = await api
          .post('/api/users/register')
          .send(userPayload.validRegistration)

        expect(status).toBe(200)
        expect(body).toEqual(userPayload.expectedOutput)
      })
    })

    describe('given the user already exists', () => {
      it('should return 409 error code', async () => {
        await api
          .post('/api/users/register')
          .send(userPayload.validRegistration)

        const { status } = await api
          .post('/api/users/register')
          .send(userPayload.validRegistration)

        expect(status).toBe(409)
      })
    })

    describe('given the user data is invalid', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post('/api/users/register')
          .send(userPayload.invalidRegistration)

        expect(status).toBe(400)
      })
    })

    describe('given the user data is incomplete', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post('/api/users/register')
          .send(userPayload.incompleteRegistration)

        expect(status).toBe(400)
      })
    })
  })

  describe('POST /users/login', () => {
    beforeAll(async () => {
      await api.post('/api/users/register').send(userPayload.validRegistration)
    })

    describe('given the user data is valid', () => {
      it('should return logged user data', async () => {
        const { status, body } = await api
          .post('/api/users/login')
          .send(userPayload.validLogin)

        expect(status).toBe(200)
        expect(body).toEqual(userPayload.expectedOutput)
      })
    })

    describe('given the user does not exist', () => {
      it('should return 404 error code', async () => {
        const { status } = await api
          .post('/api/users/login')
          .send(userPayload.nonExistentLogin)

        expect(status).toBe(404)
      })
    })

    describe('given the password is wrong', () => {
      it('should return 401 error code', async () => {
        const { status } = await api
          .post('/api/users/login')
          .send(userPayload.wrongPasswordLogin)

        expect(status).toBe(401)
      })
    })

    describe('given the user data is invalid', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post('/api/users/login')
          .send(userPayload.invalidLogin)

        expect(status).toBe(400)
      })
    })

    describe('given the user data is incomplete', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post('/api/users/login')
          .send(userPayload.incompleteLogin)

        expect(status).toBe(400)
      })
    })
  })

  describe('POST /users/logout', () => {
    it('should remove the session', async () => {
      const user = users[++i]
      const accessToken = signAccessToken(user.id)
      const refreshToken = signRefreshToken(user.id)

      const userDB = await UserModel.findById(user.id)
      if (userDB) {
        userDB.sessions = [...userDB.sessions, refreshToken]
        await userDB.save()
        expect(userDB.sessions).toContain(refreshToken)
      }

      await api
        .post('/api/users/logout')
        .set('Cookie', [
          `accessToken=${accessToken}`,
          `refreshToken=${refreshToken}`,
        ])

      const updatedUser = await UserModel.findById(user.id)
      expect(updatedUser?.sessions).not.toContain(refreshToken)
    })
  })

  describe('POST /users/logout/all', () => {
    it('should remove all sessions', async () => {
      const user = users[++i]
      const accessToken = signAccessToken(user.id)
      const refreshToken = signRefreshToken(user.id)

      const userDB = await UserModel.findById(user.id)
      if (userDB) {
        userDB.sessions = [refreshToken, refreshToken, refreshToken]
        await userDB.save()
        expect(userDB.sessions.length).toBe(3)
      }

      await api
        .post('/api/users/logout/all')
        .set('Cookie', [
          `accessToken=${accessToken}`,
          `refreshToken=${refreshToken}`,
        ])

      const updatedUser = await UserModel.findById(user.id)
      expect(updatedUser?.sessions.length).toBe(0)
    })
  })

  describe('GET /search', () => {
    describe('given the query string is correct', () => {
      it('should return a list of matching users', async () => {
        const { status, body } = await api
          .get('/api/users/search')
          .set('Cookie', user.cookies)
          .query({
            firstName: user.firstName,
            lastName: user.lastName,
            limit: 10,
          })

        expect(status).toBe(200)
        expect(body).toBeInstanceOf(Array)
      })
    })

    describe('given the query string is incorrect', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .get('/api/users/search')
          .set('Cookie', user.cookies)

        expect(status).toBe(400)
      })
    })
  })

  describe('GET /users/profile/:id', () => {
    describe('given the user exists', () => {
      it('should return user data', async () => {
        const user = users[++i]

        const { status, body } = await api
          .get(`/api/users/profile/${user.id}`)
          .set('Cookie', user.cookies)

        expect(status).toBe(200)
        expect(body).toEqual(_.omit(user, 'password', 'sessions', 'cookies'))
      })
    })

    describe('given the user does not exist', () => {
      it('should return 404 error code', async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .get(`/api/users/${fakeId}`)
          .set('Cookie', user.cookies)

        expect(status).toBe(404)
      })
    })
  })

  describe('PATCH /users/:id/friend/request', () => {
    describe('given the users are not friends', () => {
      it('should create a new pending friend request', async () => {
        const user = users[++i]
        const requestedUser = users[++i]

        const { status, body: requestedupdatedUser } = await api
          .patch(`/api/users/${requestedUser.id}/friend/request`)
          .set('Cookie', user.cookies)

        expect(status).toBe(200)
        expect(requestedupdatedUser.friendRequests).toContain(user.id)
      })
    })

    describe('given the user does not exist', () => {
      it('should return 404 error code', async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/users/${fakeId}/friend/request`)
          .set('Cookie', user.cookies)

        expect(status).toBe(404)
      })
    })

    describe('given the user wants to request self friendship', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .patch(`/api/users/${user.id}/friend/request`)
          .set('Cookie', user.cookies)

        expect(status).toBe(400)
      })
    })

    describe('given the users are already friends', () => {
      it('should return 409 error code', async () => {
        const user = users[++i]
        const requestedUser = users[++i]

        await api
          .patch(`/api/users/${requestedUser.id}/friend/request`)
          .set('Cookie', user.cookies)

        await api
          .patch(`/api/users/${user.id}/friend/accept`)
          .set('Cookie', requestedUser.cookies)

        const { status } = await api
          .patch(`/api/users/${requestedUser.id}/friend/request`)
          .set('Cookie', user.cookies)

        expect(status).toBe(409)
      })
    })

    describe('given the friend request is pending', () => {
      it('should return 409 error code', async () => {
        const user = users[++i]
        const requestedUser = users[++i]

        await api
          .patch(`/api/users/${requestedUser.id}/friend/request`)
          .set('Cookie', user.cookies)

        const { status } = await api
          .patch(`/api/users/${requestedUser.id}/friend/request`)
          .set('Cookie', user.cookies)

        expect(status).toBe(409)
      })
    })
  })

  describe('PATCH /users/:id/friend/accept', () => {
    describe('given the users have a pending request', () => {
      it('should add friend and remove pending friend request', async () => {
        const user = users[++i]
        const acceptedUser = users[++i]

        await api
          .patch(`/api/users/${user.id}/friend/request`)
          .set('Cookie', acceptedUser.cookies)

        const { status, body: updatedAcceptedUser } = await api
          .patch(`/api/users/${acceptedUser.id}/friend/accept`)
          .set('Cookie', user.cookies)

        const updatedUser = await UserModel.findById(user.id)

        const updatedUserFriends = updatedUser?.friends.map((id) =>
          id.toString()
        )
        const updatedUserFriendRequests = updatedUser?.friendRequests.map(
          (id) => id.toString()
        )

        expect(status).toBe(200)
        expect(updatedAcceptedUser.friends).toContain(user.id)
        expect(updatedUserFriends).toContain(acceptedUser.id)
        expect(updatedUserFriendRequests).not.toContain(acceptedUser.id)
      })
    })

    describe('given the user does not exist', () => {
      it('should return 404 error code', async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/users/${fakeId}/friend/accept`)
          .set('Cookie', user.cookies)

        expect(status).toBe(404)
      })
    })

    describe('given the users do not have a pending request', () => {
      it('should return 409 error code', async () => {
        const user = users[++i]
        const acceptedUser = users[++i]

        const { status } = await api
          .patch(`/api/users/${acceptedUser.id}/friend/accept`)
          .set('Cookie', user.cookies)

        expect(status).toBe(409)
      })
    })
  })

  describe('PATCH /users/:id/friend/reject', () => {
    describe('given the users have a pending request', () => {
      it('should remove pending friend request', async () => {
        const user = users[++i]
        const rejectedUser = users[++i]

        await api
          .patch(`/api/users/${user.id}/friend/request`)
          .set('Cookie', rejectedUser.cookies)

        const { status } = await api
          .patch(`/api/users/${rejectedUser.id}/friend/reject`)
          .set('Cookie', user.cookies)

        const updatedUser = await UserModel.findById(user.id)

        expect(status).toBe(200)
        expect(updatedUser?.friendRequests).not.toContain(rejectedUser.id)
      })
    })

    describe('given the user does not exist', () => {
      it('should return 404 error code', async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/users/${fakeId}/friend/reject`)
          .set('Cookie', user.cookies)

        expect(status).toBe(404)
      })
    })

    describe('given the users do not have a pending request', () => {
      it('should return 409 error code', async () => {
        const user = users[++i]
        const rejectedUser = users[++i]

        const { status } = await api
          .patch(`/api/users/${rejectedUser.id}/friend/reject`)
          .set('Cookie', user.cookies)

        expect(status).toBe(409)
      })
    })
  })

  describe('PATCH /users/:id/friend/remove', () => {
    describe('given the users are friends', () => {
      it('should unfriend users', async () => {
        const user = users[++i]
        const removedUser = users[++i]

        await api
          .patch(`/api/users/${removedUser.id}/friend/request`)
          .set('Cookie', user.cookies)

        await api
          .patch(`/api/users/${user.id}/friend/accept`)
          .set('Cookie', removedUser.cookies)

        const { status, body: updatedRemovedUser } = await api
          .patch(`/api/users/${removedUser.id}/friend/remove`)
          .set('Cookie', user.cookies)

        const updatedUser = await UserModel.findById(user.id)

        const updatedUserFriends = updatedUser?.friends.map((id) =>
          id.toString()
        )

        expect(status).toBe(200)
        expect(updatedUserFriends).not.toContain(removedUser.id)
        expect(updatedRemovedUser.friends).not.toContain(user.id)
      })
    })

    describe('given the user does not exist', () => {
      it('should return 404 error code', async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/users/${fakeId}/friend/remove`)
          .set('Cookie', user.cookies)

        expect(status).toBe(404)
      })
    })

    describe('given the users are not friends', () => {
      it('should return 409 error code', async () => {
        const user = users[++i]
        const removedUser = users[++i]

        const { status } = await api
          .patch(`/api/users/${removedUser.id}/friend/remove`)
          .set('Cookie', user.cookies)

        expect(status).toBe(409)
      })
    })
  })
})
