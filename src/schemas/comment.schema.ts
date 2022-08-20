import { z } from 'zod'

const commentSchema = z.object({
  text: z.string({
    required_error: 'Text is required',
    invalid_type_error: 'Text must be a string',
  }),
})

export default commentSchema
