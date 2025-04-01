import { User } from "~/server/models";

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)

    const userId = getRouterParam(event, "userId");

    const userData = await User.findByIdAndDelete(userId);

    if (!userData) {
      return { message: "Not Found User, please check your userId" }
    }

    return {
      message: "User deleted successfully"
    }
  } catch (error) {
    console.dir(error);

    event.res.statusCode = 500;

    return {
      message: "Something went wrong.",
    };
  }
})
