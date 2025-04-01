import { z } from "zod";
import { User } from "~/server/models";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse);

  const user = await User.findOne({ email });

  if (!user) {
    return { message: "User not found" };
  }

  const validPassword = await verifyPassword(user.password, password);

  if (!validPassword) {
    return { message: "Invalid credentials" };
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });

  return { message: "Login successfully" };
});
