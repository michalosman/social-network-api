import { connectTestingDB } from './utils/testingDB'
import request from 'supertest'
import app from '../app'
import { seedDB } from './utils/seedDB'
import { ITestUser } from './utils/factories'
import { commentPayload } from './utils/payloads'

const api = request(app)

describe('Comment API tests', () => {
  let user: ITestUser

  beforeAll(async () => {
    await connectTestingDB()
    const db = await seedDB()
    user = db.users[0]
  })

  describe('POST /comments', () => {
    describe('given the comment data is correct', () => {
      it('should return comment data', async () => {
        const { status, body } = await api
          .post('/api/comments')
          .set('Cookie', user.cookies)
          .send(commentPayload.validCreation)

        expect(status).toBe(200)
        expect(body).toEqual(commentPayload.expectedOutput)
      })
    })

    describe('given the comment data is invalid', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post('/api/comments')
          .set('Cookie', user.cookies)
          .send(commentPayload.invalidCreation)

        expect(status).toBe(400)
      })
    })

    describe('given the comment data is incomplete', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post('/api/comments')
          .set('Cookie', user.cookies)
          .send(commentPayload.incompleteCreation)

        expect(status).toBe(400)
      })
    })
  })
})
