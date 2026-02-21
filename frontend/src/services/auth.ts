import axios from 'axios';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  username: string;
  accessTokenExpiry: number;
}

class AuthService {
  private static instance: AuthService;
  private refreshTokenTimeout?: NodeJS.Timeout;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(username: string, password: string): Promise<void> {
    try {
      const response = await axios.post<AuthTokens>(
        'http://localhost:8080/auth/login',
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        this.setTokens(response.data);
        this.startRefreshTokenTimer(response.data);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response?.data) {
        throw new Error(error.response.data);
      }
      throw error;
    }
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem('token', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('username', tokens.username);
  }

  private startRefreshTokenTimer(tokens: AuthTokens): void {
    // Clear any existing timer
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    // Set timer to refresh token 1 minute before expiry
    const timeout = tokens.accessTokenExpiry - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
  }

  private async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        this.logout();
        return;
      }

      const response = await axios.post<AuthTokens>('http://localhost:8080/auth/refresh', null, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      });

      this.setTokens(response.data);
      this.startRefreshTokenTimer(response.data);
    } catch (error) {
      this.logout();
    }
  }

  public logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
    window.location.href = '/auth/login';
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export const authService = AuthService.getInstance(); 