import {
  connectTestingDatabase,
  disconnectTestingDatabase,
} from './utils/testingDatabase'
import app from '../app'
import request from 'supertest'

beforeAll(async () => {
  await connectTestingDatabase()
})

afterAll(async () => {
  await disconnectTestingDatabase()
})

describe('Tests configuration', () => {
  it('works properly', async () => {
    app.get('/', (req, res) => {
      res.sendStatus(200)
    })

    const { statusCode } = await request(app).get('/')

    expect(statusCode).toBe(200)
  })
})
