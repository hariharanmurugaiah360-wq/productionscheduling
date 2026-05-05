export type UserRole = "admin" | "manager";

export interface AppUser {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}

const STORAGE_KEY = "app_users";
const CURRENT_USER_KEY = "current_user";

const defaultUsers: AppUser[] = [
  { id: "1", username: "123456", password: "1323", role: "admin" },
];

export const getUsers = (): AppUser[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  const users = JSON.parse(stored) as AppUser[];
  // Migration: add role if missing
  let migrated = false;
  const updated = users.map((u) => {
    if (!u.role) {
      migrated = true;
      return { ...u, role: u.username === "123456" ? "admin" as UserRole : "manager" as UserRole };
    }
    return u;
  });
  if (migrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const saveUsers = (users: AppUser[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const addUser = (username: string, password: string, role: UserRole = "manager"): AppUser => {
  const users = getUsers();
  const newUser: AppUser = { id: Date.now().toString(), username, password, role };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const deleteUser = (id: string) => {
  const users = getUsers().filter((u) => u.id !== id);
  saveUsers(users);
};

export const updateUserPassword = (id: string, newPassword: string) => {
  const users = getUsers().map((u) => u.id === id ? { ...u, password: newPassword } : u);
  saveUsers(users);
};

export const validateLogin = (username: string, password: string): boolean => {
  return getUsers().some((u) => u.username === username && u.password === password);
};

export const setCurrentUser = (username: string) => {
  const user = getUsers().find((u) => u.username === username);
  if (user) sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): AppUser | null => {
  const stored = sessionStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === "admin";
};
