import { User } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)

    const userData = await User.findById(user.id).select("-password")

    if (!userData) {
      event.res.statusCode = 404
      return { message: "User not found" }
    }

    return userData
  } catch (error) {
    console.dir(error);

    event.res.statusCode = 500;

    return {
      code: "ERROR",
      message: "Something went wrong.",
    };
  }
})
