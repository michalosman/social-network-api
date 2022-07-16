import { ITestPost } from './utils/factories'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose'
import { seedDB } from './utils/seedDB'
import request from 'supertest'
import app from '../app'
import { postPayload } from './utils/payloads'
import { connectTestingDB, disconnectTestingDB } from './utils/testingDB'
import { ITestUser } from './utils/factories'
import UserModel from '../models/user.model'

const api = request(app)

describe('Post API tests', () => {
  let user: ITestUser
  let posts: ITestPost[]
  let i = 0

  beforeAll(async () => {
    await connectTestingDB()
    const db = await seedDB()
    user = db.users[0]
    posts = db.posts
  })

  afterAll(async () => {
    await disconnectTestingDB()
  })

  describe('POST /posts', () => {
    describe('given the post data is correct', () => {
      it('should return post data', async () => {
        const { status, body } = await api
          .post('/api/posts')
          .set('Cookie', user.cookies)
          .send(postPayload.validCreation)

        const updatedUser = await UserModel.findById(user.id)
        expect(updatedUser?.posts.length).toBe(1)

        expect(status).toBe(200)
        expect(body).toEqual(postPayload.expectedOutput)
      })
    })

    describe('given the post data is invalid', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post('/api/posts')
          .set('Cookie', user.cookies)
          .send(postPayload.invalidCreation)

        expect(status).toBe(400)
      })
    })

    describe('given the post data is incomplete', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post('/api/posts')
          .set('Cookie', user.cookies)
          .send(postPayload.incompleteCreation)

        expect(status).toBe(400)
      })
    })
  })

  describe('PATCH /posts/:id/like', () => {
    describe('given the post exists and is not already liked', () => {
      it('should increase post likes count by 1', async () => {
        const post = posts[++i]

        const { status, body } = await api
          .patch(`/api/posts/${post.id}/like`)
          .set('Cookie', user.cookies)

        expect(status).toBe(200)
        expect(body.likes.length).toBe(1)
      })
    })

    describe('given the post does not exist', () => {
      it('should return 404 error code', async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/posts/${fakeId}/like`)
          .set('Cookie', user.cookies)

        expect(status).toBe(404)
      })
    })

    describe('given the post is already liked', () => {
      it('should return 409 error code', async () => {
        const post = posts[++i]

        await api
          .patch(`/api/posts/${post.id}/like`)
          .set('Cookie', user.cookies)

        const { status } = await api
          .patch(`/api/posts/${post.id}/like`)
          .set('Cookie', user.cookies)

        expect(status).toBe(409)
      })
    })
  })

  describe('PATCH /posts/:id/unlike', () => {
    describe('given the post exists and is already liked', () => {
      it('should decrease post likes count by 1', async () => {
        const post = posts[++i]

        await api
          .patch(`/api/posts/${post.id}/like`)
          .set('Cookie', user.cookies)

        const { status, body } = await api
          .patch(`/api/posts/${post.id}/unlike`)
          .set('Cookie', user.cookies)

        expect(status).toBe(200)
        expect(body.likes.length).toBe(0)
      })
    })

    describe('given the post does not exist', () => {
      it('should return 404 error code', async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/posts/${fakeId}/unlike`)
          .set('Cookie', user.cookies)

        expect(status).toBe(404)
      })
    })

    describe('given the post is not liked', () => {
      it('should return 409 error code', async () => {
        const post = posts[++i]

        const { status } = await api
          .patch(`/api/posts/${post.id}/unlike`)
          .set('Cookie', user.cookies)

        expect(status).toBe(409)
      })
    })
  })
})
