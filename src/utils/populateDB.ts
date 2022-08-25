/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
import { faker } from '@faker-js/faker'

import PostModel from '../models/post.model'
import UserModel from '../models/user.model'

const populateDB = async () => {
  for (let i = 0; i < 20; i++) {
    const user = await UserModel.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      image: faker.image.avatar(),
      password: 'password',
    })

    for (let j = 0; j < 20; j++) {
      await PostModel.create({
        text: faker.lorem.paragraph(),
        author: user.id,
      })
    }
  }
}

export default populateDB
