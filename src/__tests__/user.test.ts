/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { sanitizeUser } from './../utils/sanitization'
import { signRefreshToken } from './../utils/jwt'
import { signAccessToken } from './../utils/jwt'
import { connectTestingDB, disconnectTestingDB } from './utils/testingDB'
import { userPayload } from './utils/payloads'
import request from 'supertest'
import app from '../app'
import { seedDb } from './utils/seedDB'
import { Types } from 'mongoose'
import UserModel from '../models/user.model'
import _ from 'lodash'

const api = request(app)

describe('User API tests', () => {
  let users: any[]

  beforeAll(async () => {
    await connectTestingDB()
    const db = await seedDb()

    users = db.users.map((user: any) => {
      // Reformat users data to be compatible with the API responses
      user = sanitizeUser(user)
      user._id = user._id.toString()
      // Generate tokens for operations that need auth
      user.cookies = [
        `accessToken=${signAccessToken(user._id)}`,
        `refreshToken=${signRefreshToken(user._id)}`,
      ]
      return user
    })
  })

  afterAll(async () => {
    await disconnectTestingDB()
  })

  // For registration & login we will use prepared payloads

  describe('POST /users/register', () => {
    describe('given the user data is valid', () => {
      it('should return user data', async () => {
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
      // In case we run it separately from registration tests
      await api.post('/api/users/register').send(userPayload.validRegistration)
    })

    describe('given the user data is valid', () => {
      it('should return user data', async () => {
        const { status, body } = await api
          .post('/api/users/login')
          .send(userPayload.validLogin)

        expect(status).toBe(200)
        expect(body).toEqual(userPayload.expectedOutput)
      })
    })

    describe('given the user does not exist', () => {
      it('should return a 404 error code', async () => {
        const { status } = await api
          .post('/api/users/login')
          .send(userPayload.nonExistentLogin)

        expect(status).toBe(404)
      })
    })

    describe('given the password is wrong', () => {
      it('should return a 401 error code', async () => {
        const { status } = await api
          .post('/api/users/login')
          .send(userPayload.wrongPasswordLogin)

        expect(status).toBe(401)
      })
    })

    describe('given the user data is invalid', () => {
      it('should return a 400 error code', async () => {
        const { status } = await api
          .post('/api/users/login')
          .send(userPayload.invalidLogin)

        expect(status).toBe(400)
      })
    })

    describe('given the user data is incomplete', () => {
      it('should return a 400 error code', async () => {
        const { status } = await api
          .post('/api/users/login')
          .send(userPayload.incompleteLogin)

        expect(status).toBe(400)
      })
    })
  })

  describe('POST /users/logout', () => {
    it('should remove the session', async () => {
      const accessToken = signAccessToken(users[0]._id)
      const refreshToken = signRefreshToken(users[0]._id)

      const user = await UserModel.findById(users[0]._id)
      if (!user) return
      user.sessions = [...user.sessions, refreshToken]
      await user.save()
      expect(user.sessions).toContain(refreshToken)

      await api
        .post('/api/users/logout')
        .set('Cookie', [
          `accessToken=${accessToken}`,
          `refreshToken=${refreshToken}`,
        ])

      const updatedUser = await UserModel.findById(users[0]._id)
      if (!updatedUser) return
      expect(updatedUser.sessions).not.toContain(refreshToken)
    })
  })

  describe('POST /users/logout/all', () => {
    it('should remove all sessions', async () => {
      const accessToken = signAccessToken(users[0]._id)
      const refreshToken = signRefreshToken(users[0]._id)

      const user = await UserModel.findById(users[0]._id)
      if (!user) return
      user.sessions = [refreshToken, refreshToken, refreshToken]
      await user.save()
      expect(user.sessions.length).toBe(3)

      await api
        .post('/api/users/logout/all')
        .set('Cookie', [
          `accessToken=${accessToken}`,
          `refreshToken=${refreshToken}`,
        ])

      const updatedUser = await UserModel.findById(users[0]._id)
      if (!updatedUser) return
      expect(updatedUser.sessions.length).toBe(0)
    })
  })

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const { status, body } = await api
        .get('/api/users')
        .set('Cookie', users[0].cookies)

      expect(status).toBe(200)
      expect(body).toBeInstanceOf(Array)
    })
  })

  describe('GET /users/:id', () => {
    describe('given the user exists', () => {
      it('should return user data', async () => {
        const { status, body } = await api
          .get(`/api/users/${users[1]._id}`)
          .set('Cookie', users[0].cookies)

        expect(status).toBe(200)
        expect(body).toEqual(_.omit(users[1], 'cookies'))
      })
    })

    describe('given the user does not exist', () => {
      it('should return a 404 error code', async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .get(`/api/users/${fakeId}`)
          .set('Cookie', users[0].cookies)

        expect(status).toBe(404)
      })
    })
  })

  describe('PATCH /users/:id/friend/request', () => {
    describe('given the users are not friends', () => {
      it('should return 200 success code', async () => {
        const user1 = users[0]
        const user2 = users[1]

        const { status } = await api
          .patch(`/api/users/${user2._id}/friend/request`)
          .set('Cookie', user1.cookies)

        expect(status).toBe(200)
      })
    })

    describe('given the user does not exist', () => {
      it('should return 404 error code', async () => {
        const user1 = users[0]
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/users/${fakeId}/friend/request`)
          .set('Cookie', user1.cookies)

        expect(status).toBe(404)
      })
    })

    describe('given the user wants to request self friendship', () => {
      it('should return 400 error code', async () => {
        const user1 = users[0]

        const { status } = await api
          .patch(`/api/users/${user1._id}/friend/request`)
          .set('Cookie', user1.cookies)

        expect(status).toBe(400)
      })
    })

    describe('given the users are already friends', () => {
      it('should return 409 error code', async () => {
        const user1 = users[0]
        const user2 = users[1]

        await api
          .patch(`/api/users/${user2._id}/friend/request`)
          .set('Cookie', user1.cookies)

        await api
          .patch(`/api/users/${user1._id}/friend/accept`)
          .set('Cookie', user2.cookies)

        const { status } = await api
          .patch(`/api/users/${user2._id}/friend/request`)
          .set('Cookie', user1.cookies)

        expect(status).toBe(409)
      })
    })

    describe('given the friend request is pending', () => {
      it('should return 409 error code', async () => {
        const user1 = users[0]
        const user2 = users[1]

        await api
          .patch(`/api/users/${user2._id}/friend/request`)
          .set('Cookie', user1.cookies)

        const { status } = await api
          .patch(`/api/users/${user2._id}/friend/request`)
          .set('Cookie', user1.cookies)

        expect(status).toBe(409)
      })
    })
  })

  describe('PATCH /users/:id/friend/accept', () => {
    describe('given the users have a pending request', () => {
      it('should return 200 success code', async () => {
        const user1 = users[2]
        const user2 = users[3]

        await api
          .patch(`/api/users/${user2._id}/friend/request`)
          .set('Cookie', user1.cookies)

        const { status } = await api
          .patch(`/api/users/${user1._id}/friend/accept`)
          .set('Cookie', user2.cookies)

        expect(status).toBe(200)
      })
    })

    describe('given the user does not exist', () => {
      it('should return 404 error code', async () => {
        const user1 = users[0]
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/users/${fakeId}/friend/accept`)
          .set('Cookie', user1.cookies)

        expect(status).toBe(404)
      })
    })

    describe('given the users do not have a pending request', () => {
      it('should return 409 error code', async () => {
        const user1 = users[4]
        const user2 = users[5]

        const { status } = await api
          .patch(`/api/users/${user2._id}/friend/accept`)
          .set('Cookie', user1.cookies)

        expect(status).toBe(409)
      })
    })
  })

  describe('PATCH /users/:id/friend/reject', () => {
    describe('given the users have a pending request', () => {
      it('should return 200 success code', async () => {
        const user1 = users[4]
        const user2 = users[5]

        await api
          .patch(`/api/users/${user2._id}/friend/request`)
          .set('Cookie', user1.cookies)

        const { status } = await api
          .patch(`/api/users/${user1._id}/friend/reject`)
          .set('Cookie', user2.cookies)

        expect(status).toBe(200)
      })
    })

    describe('given the user does not exist', () => {
      it('should return 404 error code', async () => {
        const user1 = users[4]
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/users/${fakeId}/friend/reject`)
          .set('Cookie', user1.cookies)

        expect(status).toBe(404)
      })
    })

    describe('given the users do not have a pending request', () => {
      it('should return 409 error code', async () => {
        const user1 = users[6]
        const user2 = users[7]

        const { status } = await api
          .patch(`/api/users/${user2._id}/friend/reject`)
          .set('Cookie', user1.cookies)

        expect(status).toBe(409)
      })
    })
  })

  describe('PATCH /users/:id/friend/remove', () => {
    describe('given the users are friends', () => {
      it('should return 200 success code', async () => {
        const user1 = users[0]
        const user2 = users[1]

        await api
          .patch(`/api/users/${user2._id}/friend/request`)
          .set('Cookie', user1.cookies)

        await api
          .patch(`/api/users/${user1._id}/friend/accept`)
          .set('Cookie', user2.cookies)

        const { status } = await api
          .patch(`/api/users/${user1._id}/friend/remove`)
          .set('Cookie', user2.cookies)

        expect(status).toBe(200)
      })
    })

    describe('given the user does not exist', () => {
      it('should return 404 error code', async () => {
        const user1 = users[0]
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/users/${fakeId}/friend/remove`)
          .set('Cookie', user1.cookies)

        expect(status).toBe(404)
      })
    })

    describe('given the users are not friends', () => {
      it('should return 409 error code', async () => {
        const user1 = users[8]
        const user2 = users[9]

        const { status } = await api
          .patch(`/api/users/${user2._id}/friend/remove`)
          .set('Cookie', user1.cookies)

        expect(status).toBe(409)
      })
    })
  })
})
