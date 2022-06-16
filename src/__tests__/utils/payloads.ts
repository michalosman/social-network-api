export const userPayload = {
  expectedOutput: {
    _id: expect.any(String),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    image: expect.any(String),
    friends: expect.any(Array),
    friendRequests: expect.any(Array),
    posts: expect.any(Array),
    __v: expect.any(Number),
  },

  validRegistration: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    password: 'password',
  },

  invalidRegistration: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'wrong_mail',
    password: 'password',
  },

  incompleteRegistration: {
    firstName: 'John',
    email: 'wrong_mail',
    password: 'password',
  },

  validLogin: {
    email: 'john.doe@gmail.com',
    password: 'password',
  },

  invalidLogin: {
    email: 'wrong_mail',
    password: 'password',
  },

  incompleteLogin: {
    password: 'password',
  },

  nonExistentLogin: {
    email: 'jane.doe@gmail.com',
    password: 'password',
  },

  wrongPasswordLogin: {
    email: 'john.doe@gmail.com',
    password: 'wrong_password',
  },
}
