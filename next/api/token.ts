export const getToken = async (): Promise<string | null> => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem("x-access-token");
  }
  return null;
};

export const setToken = async (token: string): Promise<void> => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem("x-access-token", token);
  }
};