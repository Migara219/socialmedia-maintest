import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const getWelcomeMessage = async (): Promise<string> => {
    try {
        const response = await axios.get(`${BASE_URL}/auth/welcome`);
        return response.data;
    } catch (error) {
        throw new Error('Internal server error.');
    }
};

export const loginUser = async (username:string, password: string) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
        username,
        password,
    });
    return response.data;
}

export const getProtectedData = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/protected-endpoint`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const signup = async (userData: {
    username: string;
    email: string;
    password: string;
    roles: string;
  }) => {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  
    return await response.json();
  };
