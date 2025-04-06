export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn, user } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo("/login");
  }

  const allowedRoles = (to.meta.allowedRoles as string[]) || [];

  if (!allowedRoles.includes(user.value?.role ?? "")) {
    return navigateTo("/");
  }
});
