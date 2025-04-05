import { z } from 'zod'
import { User } from '~/server/models';

const bodySchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["admin", "moderator", "user"]).optional(),
});

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');
  const updateData = await readValidatedBody(event, bodySchema.parse);

  if (!userId) {
    return { message: "User ID is required" };
  }

  try {
    const { user } = await requireUserSession(event);

    if (user.role !== "admin") {
      return { message: "Unathorized" }
    }

    if (!user || (user.role !== "admin" && user.id !== userId)) {
      return { message: "Forbidden: you can only update your own profile unless you're an admin" };
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return { message: "User not found" };
    }

    if (updateData.email) {
      const emailTaken = await User.findOne({ email: updateData.email });
      if (emailTaken && emailTaken.id !== userId) {
        return { message: "Email already registered" };
      }
    }

    if (updateData.password && updateData.password.trim() !== "") {
      updateData.password = await hashPassword(updateData.password);
    } else {
      delete updateData.password;
    }

    await User.findByIdAndUpdate(userId, updateData);

    return { message: "User updated successfully" };
  } catch (error) {
    console.error(error);

    event.res.statusCode = 500;

    return { message: "Something went wrong." };
  }
});
