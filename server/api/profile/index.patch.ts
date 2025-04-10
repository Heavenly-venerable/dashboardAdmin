import { z } from 'zod';
import { User } from '~/server/models';

const updateSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  currentPassword: z.string().min(8).optional()
}).refine(data => {
  if (data.password && !data.currentPassword) {
    return false;
  }
  return true;
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, updateSchema.parse);

  try {
    const { user: sessionUser } = await requireUserSession(event);
    const user = await User.findById(sessionUser.id);

    if (!user) {
      return { message: "User not found" };
    }

    if (body.username) {
      user.username = body.username;
    }

    if (body.email) {
      const existingUser = await User.findOne({ email: body.email, _id: { $ne: user._id } });
      if (existingUser) {
        return { message: "Email already in use" };
      }
      user.email = body.email;
    }

    if (body.password && body.currentPassword) {
      const isPasswordValid = await verifyPassword(body.currentPassword, user.password);
      if (!isPasswordValid) {
        return { message: "Current password is incorrect" };
      }
      user.password = await hashPassword(body.password);
    }

    await user.save();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: body },
      { new: true, select: '-password -__v' }
    );

    if (body.email) {
      await setUserSession(event, {
        user: {
          ...sessionUser,
          email: body.email
        }
      })
    }

    return {
      message: "Profile updated successfully",
      user: updatedUser
    };
  } catch (error) {
    console.error(error);
    event.res.statusCode = 500;
    return { message: "Something went wrong" };
  }
});
