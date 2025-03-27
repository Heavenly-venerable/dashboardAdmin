import { z } from 'zod'
import { User } from '~/server/models';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    return { message: "Email already registered" }
  }

  const hashedPassword = await hashPassword(password)

  const newUser = new User({ email, password: hashedPassword })

  newUser.save()

  return { message: "User registered successfully" }
});
