/* eslint-disable import/prefer-default-export */
import { z } from 'zod'

export const createCommentSchema = z.object({
  text: z.string({
    required_error: 'Text is required',
    invalid_type_error: 'Text must be a string',
  }),
})
