import { User } from "~/server/models"

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)

    if (user.role !== "admin" && user.role !== "moderator") {
      return { message: "Unathorized" }
    }

    const users = await User.find()

    if (users.length === 0) {
      return { message: "Empty Users" }
    }

    return {
      message: "Users finded successfully",
      users
    }
  } catch (error) {
    console.dir(error);

    event.res.statusCode = 500;

    return {
      message: "Something went wrong.",
    };
  }
})
