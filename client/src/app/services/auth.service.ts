import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../models/entry.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiBaseUrl;
  private readonly tokenKey = 'er_token';
  private readonly emailKey = 'er_email';

  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  readonly isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/register`, { email, password });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.emailKey, res.user.email);
          this.loggedInSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
    this.loggedInSubject.next(false);
  }

  getToken(): string {
    return localStorage.getItem(this.tokenKey) || '';
  }

  getEmail(): string {
    return localStorage.getItem(this.emailKey) || '';
  }

  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
