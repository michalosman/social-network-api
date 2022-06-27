/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from 'mongoose'
import { seedDb } from './utils/seedDB'
import request from 'supertest'
import app from '../app'
import { postPayload } from './utils/payloads'
import { connectTestingDB } from './utils/testingDB'
import { signAccessToken, signRefreshToken } from '../utils/jwt'

const api = request(app)

describe('Post API tests', () => {
  let user: any
  let posts: any

  beforeAll(async () => {
    await connectTestingDB()
    const db = await seedDb()

    user = db.users[0]
    user.cookies = [
      `accessToken=${signAccessToken(user._id)}`,
      `refreshToken=${signRefreshToken(user._id)}`,
    ]

    posts = db.posts.map((post: any) => {
      return { ...post, _id: post._id.toString() }
    })
  })

  describe('POST /posts', () => {
    describe('given the post data is correct', () => {
      it('should return post data', async () => {
        const { status, body } = await api
          .post('/api/posts')
          .set('Cookie', [
            `accessToken=${user.accessToken}`,
            `refreshToken=${user.refreshToken}`,
          ])
          .send(postPayload.validCreation)

        expect(status).toBe(200)
        expect(body).toBe(postPayload.expectedOutput)
      })
    })

    describe('given the post data is invalid', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post('/api/posts')
          .set('Cookie', [
            `accessToken=${user.accessToken}`,
            `refreshToken=${user.refreshToken}`,
          ])
          .send(postPayload.invalidCreation)

        expect(status).toBe(400)
      })
    })

    describe('given the post data is incomplete', () => {
      it('should return 400 error code', async () => {
        const { status } = await api
          .post('/api/posts')
          .set('Cookie', [
            `accessToken=${user.accessToken}`,
            `refreshToken=${user.refreshToken}`,
          ])
          .send(postPayload.incompleteCreation)

        expect(status).toBe(400)
      })
    })
  })

  describe('PATCH /posts/:id/like', () => {
    describe('given the post exists and is not already liked', () => {
      it('should increase post likes count by 1', async () => {
        const post = posts[0]

        const { status, body } = await api
          .patch(`/api/posts/${post._id}/like`)
          .set('Cookie', [
            `accessToken=${user.accessToken}`,
            `refreshToken=${user.refreshToken}`,
          ])

        expect(status).toBe(200)
        expect(body.likes.length).toBe(post.likes.length + 1)
      })
    })

    describe('given the post does not exist', () => {
      it('should return 404 error code', async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/posts/${fakeId}/like`)
          .set('Cookie', [
            `accessToken=${user.accessToken}`,
            `refreshToken=${user.refreshToken}`,
          ])

        expect(status).toBe(404)
      })
    })

    describe('given the post is already liked', () => {
      it('should not increase likes count and return 409 error code', async () => {
        const post = posts[0]

        await api
          .patch(`/api/posts/${post._id}/like`)
          .set('Cookie', [
            `accessToken=${user.accessToken}`,
            `refreshToken=${user.refreshToken}`,
          ])

        const { status, body } = await api
          .patch(`/api/posts/${post._id}/like`)
          .set('Cookie', [
            `accessToken=${user.accessToken}`,
            `refreshToken=${user.refreshToken}`,
          ])

        expect(status).toBe(409)
        expect(body.likes.length).toBe(post.likes.length)
      })
    })
  })

  describe('PATCH /posts/:id/unlike', () => {
    describe('given the post exists and is already liked', () => {
      it('should decrease post likes count by 1', async () => {
        const post = posts[1]

        const resLiked = await api
          .patch(`/api/posts/${post._id}/like`)
          .set('Cookie', [
            `accessToken=${user.accessToken}`,
            `refreshToken=${user.refreshToken}`,
          ])

        expect(resLiked.body.likes.length).toBe(post.likes.length + 1)

        const { status, body } = await api
          .patch(`/api/posts/${post._id}/unlike`)
          .set('Cookie', [
            `accessToken=${user.accessToken}`,
            `refreshToken=${user.refreshToken}`,
          ])

        expect(status).toBe(200)
        expect(body.likes.length).toBe(post.likes.length)
      })
    })

    describe('given the post does not exist', () => {
      it('should return 404 error code', async () => {
        const fakeId = new Types.ObjectId()

        const { status } = await api
          .patch(`/api/posts/${fakeId}/unlike`)
          .set('Cookie', [
            `accessToken=${user.accessToken}`,
            `refreshToken=${user.refreshToken}`,
          ])

        expect(status).toBe(404)
      })
    })

    describe('given the post is not liked', () => {
      it('should not increase likes count and return 409 error code', async () => {
        const post = posts[1]

        const { status, body } = await api
          .patch(`/api/posts/${post._id}/unlike`)
          .set('Cookie', [
            `accessToken=${user.accessToken}`,
            `refreshToken=${user.refreshToken}`,
          ])

        expect(status).toBe(409)
        expect(body.likes.length).toBe(post.likes.length)
      })
    })
  })
})
