import { toast } from "@/components/ui/use-toast";

interface User {
  username: string;
  isAuthenticated: boolean;
}

interface Credentials {
  username: string;
  password: string;
}

// In a real app, this would be stored securely and not in localStorage
const STORAGE_KEY = "cms_user_data";
const DEFAULT_USER = { username: "admin", password: "admin" };

// Initialize localStorage with default user if none exists
const initializeStorage = () => {
  const existingData = localStorage.getItem(STORAGE_KEY);
  
  if (!existingData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      users: [DEFAULT_USER]
    }));
  }
};

// Call this function when the app starts
initializeStorage();

export const login = (credentials: Credentials): User | null => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const user = data.users.find(
    (u: Credentials) => 
      u.username === credentials.username && 
      u.password === credentials.password
  );

  if (user) {
    const authUser = { 
      username: user.username, 
      isAuthenticated: true 
    };
    sessionStorage.setItem("currentUser", JSON.stringify(authUser));
    return authUser;
  }

  toast({
    title: "Login Failed",
    description: "Invalid username or password",
    variant: "destructive",
  });
  
  return null;
};

export const logout = () => {
  sessionStorage.removeItem("currentUser");
  return { username: "", isAuthenticated: false };
};

export const getCurrentUser = (): User | null => {
  const userJson = sessionStorage.getItem("currentUser");
  if (!userJson) return null;
  
  return JSON.parse(userJson);
};

export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  return !!user?.isAuthenticated;
};

export const changePassword = (username: string, newPassword: string): boolean => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const userIndex = data.users.findIndex((u: Credentials) => u.username === username);

  if (userIndex !== -1) {
    data.users[userIndex].password = newPassword;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  }

  return false;
};