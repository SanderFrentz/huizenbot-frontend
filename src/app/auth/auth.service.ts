// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'authToken';

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  login(email: string, password: string) {
    if (typeof window === 'undefined') return;

    return this.http.post<{ access_token: string }>('https://api.huizenbot.sanderfrentz.nl/login', { email, password })
      .subscribe({
        next: (res) => {
          localStorage.setItem(this.tokenKey, res.access_token);
          this.router.navigate(['/users']);
        },
        error: () => alert('Invalid login')
      });
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      this.router.navigate(['/login']);
    }
  }

  constructor(private http: HttpClient, private router: Router) {}
}