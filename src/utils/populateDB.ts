/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
import { faker } from '@faker-js/faker'

import CommentModel from '../models/comment.model'
import PostModel from '../models/post.model'
import UserModel from '../models/user.model'

const populateDB = async () => {
  for (let i = 0; i < 10; i++) {
    const user = await UserModel.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      image: faker.image.avatar(),
      password: 'password',
    })

    for (let j = 0; j < 10; j++) {
      const post = await PostModel.create({
        text: faker.lorem.paragraph(),
        author: user.id,
      })

      for (let k = 0; k < 10; k++) {
        await CommentModel.create({
          text: faker.lorem.paragraph(),
          author: user.id,
          post: post.id,
        })
      }
    }
  }
}

export default populateDB
