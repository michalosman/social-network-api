import { Types } from 'mongoose'
import request from 'supertest'

import app from '../app'
import PostModel from '../models/post.model'
import { ITestPost, ITestUser } from './utils/factories'
import { commentPayload } from './utils/payloads'
import { seedDB } from './utils/seedDB'
import { connectTestingDB } from './utils/testingDB'

const api = request(app)

describe('Comment API tests', () => {
  let user: ITestUser
  let post: ITestPost

  beforeAll(async () => {
    await connectTestingDB()
    const db = await seedDB()
    user = db.users[0]
    post = db.posts[0]
  })

  describe('POST /comments/:postId', () => {
    describe('given the comment data is correct', () => {
      it('should add comment to post and return comment data', async () => {
        const { status, body } = await api
          .post(`/api/comments/${post.id}`)
          .set('Cookie', user.cookies)
          .send(commentPayload.validCreation)

        const updatedPost = await PostModel.findById(post.id)
        expect(updatedPost?.comments.length).toBe(1)

        expect(status).toBe(200)
        expect(body).toEqual(commentPayload.expectedOutput)
      })
    })

    describe('given the comment data is invalid', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post(`/api/comments/${post.id}`)
          .set('Cookie', user.cookies)
          .send(commentPayload.invalidCreation)

        expect(status).toBe(400)
      })
    })

    describe('given the comment data is incomplete', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post(`/api/comments/${post.id}`)
          .set('Cookie', user.cookies)
          .send(commentPayload.incompleteCreation)

        expect(status).toBe(400)
      })
    })
  })

  describe('GET /comments/:postId', () => {
    describe('given the post exists', () => {
      it(`should return a list of post's comments`, async () => {
        const { status, body } = await api
          .get(`/api/comments/${post.id}`)
          .set('Cookie', user.cookies)

        expect(status).toBe(200)
        expect(body).toBeInstanceOf(Array)
      })
    })

    describe('given the post does not exist', () => {
      it(`should return 404 error code`, async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .get(`/api/comments/${fakeId}`)
          .set('Cookie', user.cookies)

        expect(status).toBe(404)
      })
    })
  })
})
