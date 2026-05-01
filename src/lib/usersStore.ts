export interface AppUser {
  id: string;
  username: string;
  password: string;
}

const STORAGE_KEY = "app_users";

const defaultUsers: AppUser[] = [
  { id: "1", username: "123456", password: "1323" },
];

export const getUsers = (): AppUser[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
};

export const saveUsers = (users: AppUser[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const addUser = (username: string, password: string): AppUser => {
  const users = getUsers();
  const newUser: AppUser = { id: Date.now().toString(), username, password };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const deleteUser = (id: string) => {
  const users = getUsers().filter((u) => u.id !== id);
  saveUsers(users);
};

export const validateLogin = (username: string, password: string): boolean => {
  return getUsers().some((u) => u.username === username && u.password === password);
};
