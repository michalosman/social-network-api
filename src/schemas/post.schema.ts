import { z } from 'zod'

const createPostSchema = z
  .object({
    text: z.string(),
    image: z.string(),
  })
  .partial()
  .refine(
    (data) => data.text || data.image,
    'Post must have either text or image.'
  )

export default createPostSchema
