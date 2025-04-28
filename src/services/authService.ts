import { toast } from "@/components/ui/use-toast";

interface User {
  username: string;
  isAuthenticated: boolean;
}

interface Credentials {
  username: string;
  password: string;
}

const API_URL = 'http://localhost:3001/api';

export const login = async (credentials: Credentials): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data = await response.json();
      const authUser = {
        username: data.user.username,
        isAuthenticated: true
      };
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      return authUser;
    }

    toast({
      title: "Login Failed",
      description: "Invalid username or password",
      variant: "destructive",
    });
    return null;
  } catch (error) {
    console.log('Login error:', error);
    toast({
      title: "Login Failed",
      description: "Could not connect to authentication server",
      variant: "destructive",
    });
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("authToken");
  return { username: "", isAuthenticated: false };
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem("currentUser");
  if (!userJson) return null;
  
  return JSON.parse(userJson);
};

export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  return !!user?.isAuthenticated;
};

export const changePassword = (username: string, newPassword: string): boolean => {
  const data = JSON.parse(localStorage.getItem("cms_user_data") || "{}");
  const userIndex = data.users?.findIndex((u: Credentials) => u.username === username);

  if (userIndex !== -1) {
    data.users[userIndex].password = newPassword;
    localStorage.setItem("cms_user_data", JSON.stringify(data));
    return true;
  }

  return false;
};