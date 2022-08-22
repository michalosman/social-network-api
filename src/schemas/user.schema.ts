import { z } from 'zod'

export const registerUserSchema = z.object({
  firstName: z.string({
    required_error: 'First name is required',
    invalid_type_error: 'First name must be a string',
  }),
  lastName: z.string({
    required_error: 'Last name is required',
    invalid_type_error: 'Last name must be a string',
  }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Email is invalid' }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(6, 'Password too short - should be at least 6 characters long'),
  image: z
    .string({
      invalid_type_error: 'Image must be a string',
    })
    .optional(),
})

export const loginUserSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Email is invalid' }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(6, 'Password too short - should be at least 6 characters long'),
})

export const updateUserSchema = z.object({
  firstName: z
    .string({
      invalid_type_error: 'First name must be a string',
    })
    .optional(),
  lastName: z
    .string({
      invalid_type_error: 'Last name must be a string',
    })
    .optional(),
  email: z
    .string({
      invalid_type_error: 'Email must be a string',
    })
    .email({ message: 'Email is invalid' })
    .optional(),
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
    })
    .min(6, 'Password too short - should be at least 6 characters long')
    .optional(),
  image: z
    .string({
      invalid_type_error: 'Image must be a string',
    })
    .optional(),
})
