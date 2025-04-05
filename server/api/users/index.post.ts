import { z } from 'zod'
import { User } from '~/server/models';

const bodySchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "moderator", "user"])
})

export default defineEventHandler(async (event) => {
  const { username, email, password, role = "user" } = await readValidatedBody(event, bodySchema.parse)

  try {
    const { user } = await requireUserSession(event)

    if (user.role !== "admin" && user.role !== "moderator") {
      return { message: "Unathorized" }
    }

    if (user.role !== "admin" && role !== "user") {
      return { message: "Forbidden: you can only create users with role user" }
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return { message: "Email already registered" }
    }

    const hashedPassword = await hashPassword(password)

    const newUser = new User({ username, email, password: hashedPassword, role })

    await newUser.save()

    return { message: "User registered successfully" }
  } catch (error) {
    console.dir(error);

    event.res.statusCode = 500;

    return {
      message: "Something went wrong.",
    };
  }
});
