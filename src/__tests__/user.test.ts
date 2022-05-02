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
      it('should return 400 error', async () => {
        const { status } = await request(app)
          .post('/api/users/register')
          .send(userPayload.invalidRegistration)

        expect(status).toBe(400)
      })
    })

    describe('given the user data is incomplete', () => {
      it('should return 400 error', async () => {
        const { status } = await request(app)
          .post('/api/users/register')
          .send(userPayload.incompleteRegistration)

        expect(status).toBe(400)
      })
    })

    describe('given the user already exists', () => {
      it('should return 409 error', async () => {
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
      it('should return a 400 error', async () => {
        const { status } = await request(app)
          .post('/api/users/login')
          .send(userPayload.invalidLogin)

        expect(status).toBe(400)
      })
    })

    describe('given the user data is incomplete', () => {
      it('should return a 400 error', async () => {
        const { status } = await request(app)
          .post('/api/users/login')
          .send(userPayload.incompleteLogin)

        expect(status).toBe(400)
      })
    })

    describe('given the user does not exist', () => {
      it('should return a 404 error', async () => {
        const { status } = await request(app)
          .post('/api/users/login')
          .send(userPayload.nonExistentLogin)

        expect(status).toBe(404)
      })
    })

    describe('given the password is wrong', () => {
      it('should return a 400 error', async () => {
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
      it('should return a 404 error', async () => {
        const { status } = await request(app).get('/api/users/000')

        expect(status).toBe(404)
      })
    })
  })

  describe('PATCH /users/:id/friend/request', () => {
    // TODO
  })
  describe('PATCH /users/:id/friend/accept', () => {
    // TODO
  })
  describe('PATCH /users/:id/friend/reject', () => {
    // TODO
  })
  describe('PATCH /users/:id/friend/remove', () => {
    // TODO
  })
})
