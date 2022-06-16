/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { sanitizeUser } from './../utils/sanitization'
import { signRefreshToken } from './../utils/jwt'
import { signAccessToken } from './../utils/jwt'
import { connectTestingDB, disconnectTestingDB } from './utils/testingDB'
import { userPayload } from './utils/payloads'
import request from 'supertest'
import app from '../app'
import { seedData, seedDb } from './utils/seedDB'
import { Types } from 'mongoose'
import UserModel from '../models/user.model'

const api = request(app)

describe('User API tests', () => {
  let db: seedData
  let user1: any
  let user2: any
  let cookies: string[]

  beforeAll(async () => {
    await connectTestingDB()
    db = await seedDb()

    // Reformat users data to be compatible with the API responses
    user1 = sanitizeUser(db.users[0])
    user2 = sanitizeUser(db.users[1])
    user1._id = user1._id.toString()
    user2._id = user2._id.toString()

    // Create cookies for each operation that needs auth
    const accessToken = signAccessToken(user1._id)
    const refreshToken = signRefreshToken(user1._id)
    cookies = [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]
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

    describe.skip('given the user data is invalid', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post('/api/users/register')
          .send(userPayload.invalidRegistration)

        expect(status).toBe(400)
      })
    })

    describe.skip('given the user data is incomplete', () => {
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

    describe.skip('given the user data is invalid', () => {
      it('should return a 400 error code', async () => {
        const { status } = await api
          .post('/api/users/login')
          .send(userPayload.invalidLogin)

        expect(status).toBe(400)
      })
    })

    describe.skip('given the user data is incomplete', () => {
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
      const accessToken = signAccessToken(user1._id)
      const refreshToken = signRefreshToken(user1._id)

      const user = await UserModel.findById(user1._id)
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

      const updatedUser = await UserModel.findById(user1._id)
      if (!updatedUser) return
      expect(updatedUser.sessions).not.toContain(refreshToken)
    })
  })

  describe('POST /users/logout/all', () => {
    it('should remove all sessions', async () => {
      const accessToken = signAccessToken(user1._id)
      const refreshToken = signRefreshToken(user1._id)

      const user = await UserModel.findById(user1._id)
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

      const updatedUser = await UserModel.findById(user1._id)
      if (!updatedUser) return
      expect(updatedUser.sessions.length).toBe(0)
    })
  })

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const { status, body } = await api
        .get('/api/users')
        .set('Cookie', cookies)

      expect(status).toBe(200)
      expect(body).toBeInstanceOf(Array)
    })
  })

  describe('GET /users/:id', () => {
    describe('given the user exists', () => {
      it('should return user data', async () => {
        const { status, body } = await api
          .get(`/api/users/${user2._id}`)
          .set('Cookie', cookies)

        expect(status).toBe(200)
        expect(body).toEqual(user2)
      })
    })

    describe('given the user does not exist', () => {
      it('should return a 404 error code', async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .get(`/api/users/${fakeId}`)
          .set('Cookie', cookies)

        expect(status).toBe(404)
      })
    })
  })

  describe.skip('PATCH /users/:id/friend/request', () => {
    describe('given the users are not friends', () => {
      it('should return 200 success code', async () => {
        const { status } = await api
          .patch(`/api/users/${user2._id}/request`)
          .send(user1)

        expect(status).toBe(200)
      })
    })
    describe('given the users are already friends', () => {
      it('should return 400 error code', async () => {
        await api.patch(`/api/users/${user1._id}/accept`).send(user2)

        const { status } = await api
          .patch(`/api/users/${user2._id}/request`)
          .send(user1)

        expect(status).toBe(400)
      })
    })
  })

  describe.skip('PATCH /users/:id/friend/accept', () => {
    it('should return 200 success code', async () => {
      const user1 = db.users[2]
      const user2 = db.users[3]

      await api.patch(`/api/users/${user2._id}/request`).send(user1)

      const { status } = await api
        .patch(`/api/users/${user1._id}/accept`)
        .send(user2)

      expect(status).toBe(200)
    })
  })

  describe.skip('PATCH /users/:id/friend/reject', () => {
    it('should return 200 success code', async () => {
      const user1 = db.users[4]
      const user2 = db.users[5]

      await api.patch(`/api/users/${user2._id}/request`).send(user1)

      const { status } = await api
        .patch(`/api/users/${user1._id}/reject`)
        .send(user2)

      expect(status).toBe(200)
    })
  })

  describe.skip('PATCH /users/:id/friend/remove', () => {
    it('should return 200 success code', async () => {
      const user1 = db.users[0]
      const user2 = db.users[1]

      const { status } = await api
        .patch(`/api/users/${user1._id}/remove`)
        .send(user2)

      expect(status).toBe(200)
    })
  })
})
