/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */

import { faker } from '@faker-js/faker'

import { TEST_USER_ID } from '../configs/constants'
import PostModel from '../models/post.model'
import UserModel from '../models/user.model'

const populateDB = async () => {
  const testUser = await UserModel.findById(TEST_USER_ID)
  if (!testUser) return

  for (let i = 0; i < 20; i++) {
    const user = new UserModel({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      image: faker.image.avatar(),
      password: faker.internet.password(),
    })

    for (let j = 0; j < 20; j++) {
      await PostModel.create({
        text: faker.lorem.paragraph(),
        author: user.id,
      })
    }

    testUser.friends.push(user.id)
    user.friends.push(testUser.id)
    await user.save()
  }
  await testUser.save()
}

export default populateDB
