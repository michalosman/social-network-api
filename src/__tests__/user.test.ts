/* eslint-disable @typescript-eslint/ban-ts-comment */
import { connectTestingDB, disconnectTestingDB } from './utils/testingDB'
import { userPayload } from './utils/payloads'
import request from 'supertest'
import app from '../app'
import { seedData, seedDb } from './utils/seedDB'

describe('User API tests', () => {
  let seededData: seedData

  beforeAll(async () => {
    await connectTestingDB()
    seededData = await seedDb()
  })

  afterAll(async () => {
    await disconnectTestingDB()
  })

  describe('POST /users/register', () => {
    describe('given the user data is valid', () => {
      it('should return user data', async () => {
        const { status, body } = await request(app)
          .post('/api/users/register')
          .send(userPayload.validRegistration)

        expect(status).toBe(200)
        expect(body).toEqual(userPayload.expectedOutput)
      })
    })

    describe('given the user data is invalid', () => {
      it('should return 400 error code', async () => {
        const { status } = await request(app)
          .post('/api/users/register')
          .send(userPayload.invalidRegistration)

        expect(status).toBe(400)
      })
    })

    describe('given the user data is incomplete', () => {
      it('should return 400 error code', async () => {
        const { status } = await request(app)
          .post('/api/users/register')
          .send(userPayload.incompleteRegistration)

        expect(status).toBe(400)
      })
    })

    describe('given the user already exists', () => {
      it('should return 409 error code', async () => {
        const existingUser = seededData.users[0]

        const existingRegistrationPayload = {
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          password: 'password',
        }

        const { status } = await request(app)
          .post('/api/users/register')
          .send(existingRegistrationPayload)

        expect(status).toBe(409)
      })
    })
  })

  // We will use credentials of user created in registration tests
  describe('POST /users/login', () => {
    describe('given the user data is valid', () => {
      it('should return user data', async () => {
        const { status, body } = await request(app)
          .post('/api/users/login')
          .send(userPayload.validLogin)

        expect(status).toBe(200)
        expect(body).toEqual(userPayload.expectedOutput)
      })
    })

    describe('given the user data is invalid', () => {
      it('should return a 400 error code', async () => {
        const { status } = await request(app)
          .post('/api/users/login')
          .send(userPayload.invalidLogin)

        expect(status).toBe(400)
      })
    })

    describe('given the user data is incomplete', () => {
      it('should return a 400 error code', async () => {
        const { status } = await request(app)
          .post('/api/users/login')
          .send(userPayload.incompleteLogin)

        expect(status).toBe(400)
      })
    })

    describe('given the user does not exist', () => {
      it('should return a 404 error code', async () => {
        const { status } = await request(app)
          .post('/api/users/login')
          .send(userPayload.nonExistentLogin)

        expect(status).toBe(404)
      })
    })

    describe('given the password is wrong', () => {
      it('should return a 400 error code', async () => {
        const { status } = await request(app)
          .post('/api/users/login')
          .send(userPayload.wrongPasswordLogin)

        expect(status).toBe(400)
      })
    })
  })

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const { status, body } = await request(app).get('/api/users')

      expect(status).toBe(200)
      expect(body).toBeInstanceOf(Array)
    })
  })

  describe('GET /users/:id', () => {
    describe('given the user exists', () => {
      it('should return user data', async () => {
        const existingUser = seededData.users[0]
        const { status, body } = await request(app).get(
          `/api/users/${existingUser._id}`
        )

        expect(status).toBe(200)
        expect(body).toEqual(existingUser)
      })
    })
    describe('given the user does not exist', () => {
      it('should return a 404 error code', async () => {
        const { status } = await request(app).get('/api/users/000')

        expect(status).toBe(404)
      })
    })
  })

  // TODO 1: use jwt token instead of sending user data
  // TODO 2: add checks for invalid tokens and id's
  // TODO 3: think of other possible errors
  describe('PATCH /users/:id/friend/request', () => {
    describe('given the users are not friends', () => {
      it('should return 200 success code', async () => {
        const user1 = seededData.users[0]
        const user2 = seededData.users[1]

        const { status } = await request(app)
          .patch(`/api/users/${user2._id}/request`)
          .send(user1)

        expect(status).toBe(200)
      })
    })
    describe('given the users are already friends', () => {
      it('should return 400 error code', async () => {
        const user1 = seededData.users[0]
        const user2 = seededData.users[1]

        await request(app).patch(`/api/users/${user1._id}/accept`).send(user2)

        const { status } = await request(app)
          .patch(`/api/users/${user2._id}/request`)
          .send(user1)

        expect(status).toBe(400)
      })
    })
  })
  describe('PATCH /users/:id/friend/accept', () => {
    it('should return 200 success code', async () => {
      const user1 = seededData.users[2]
      const user2 = seededData.users[3]

      await request(app).patch(`/api/users/${user2._id}/request`).send(user1)

      const { status } = await request(app)
        .patch(`/api/users/${user1._id}/accept`)
        .send(user2)

      expect(status).toBe(200)
    })
  })
  describe('PATCH /users/:id/friend/reject', () => {
    it('should return 200 success code', async () => {
      const user1 = seededData.users[4]
      const user2 = seededData.users[5]

      await request(app).patch(`/api/users/${user2._id}/request`).send(user1)

      const { status } = await request(app)
        .patch(`/api/users/${user1._id}/reject`)
        .send(user2)

      expect(status).toBe(200)
    })
  })
  describe('PATCH /users/:id/friend/remove', () => {
    it('should return 200 success code', async () => {
      const user1 = seededData.users[0]
      const user2 = seededData.users[1]

      const { status } = await request(app)
        .patch(`/api/users/${user1._id}/remove`)
        .send(user2)

      expect(status).toBe(200)
    })
  })
})
