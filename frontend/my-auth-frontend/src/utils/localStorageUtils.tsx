export const getPendingVerificationEmail = () => {
  const authString = localStorage.getItem('auth');
  if (!authString) return null;

  try {
    const auth = JSON.parse(authString);
    // prefer the email field at top level or fallback to user.email
    return auth.email ?? auth.user?.email ?? null;
  } catch {
    return null;
  }
}
export const setPendingVerificationEmail = (email: string) => localStorage.setItem('auth.email', email);
export const clearPendingVerificationEmail = () => localStorage.removeItem('auth.email');
