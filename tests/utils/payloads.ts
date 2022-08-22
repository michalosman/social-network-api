export const userPayload = {
  expectedOutput: {
    id: expect.any(String),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    image: '',
    friends: [],
    friendRequests: [],
    posts: [],
    // Secured: password, sessions
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

  validUpdate: {
    email: 'jane.doe@gmail.com',
  },

  invalidUpdate: {
    email: 'wrong_mail',
  },
}

export const postPayload = {
  expectedOutput: {
    id: expect.any(String),
    text: 'Post test',
    image: '',
    author: expect.any(Object),
    likes: [],
    comments: [],
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },

  validCreation: {
    text: 'Post test',
  },

  invalidCreation: {
    text: 123,
  },

  incompleteCreation: {},
}

export const commentPayload = {
  expectedOutput: {
    id: expect.any(String),
    text: 'Comment test',
    author: expect.any(Object),
    post: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  },

  validCreation: {
    text: 'Comment test',
  },

  invalidCreation: {
    text: 123,
  },

  incompleteCreation: {},
}
