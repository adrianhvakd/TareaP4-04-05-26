import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable, of, tap, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private router = inject(Router);

  private _authChecked = false;
  private _initialCheckComplete = false;

  user = signal<any | null>(null);
  isAuthenticated = signal<boolean>(false);
  isAuthLoading = computed(() => !this._initialCheckComplete);

  private initComplete$ = new BehaviorSubject<boolean>(false);

  get authCheckedSignal(): boolean {
    return this._authChecked;
  }

  initializeAndGetAuthStatus(): Observable<boolean> {
    if (this._authChecked) {
      if (typeof window !== 'undefined' && (window as any).angularAppReady) {
        (window as any).angularAppReady();
      }
      return of(this.isAuthenticated());
    }

    return this.http.get<any>(`${this.apiUrl}/auth/check`, { withCredentials: true }).pipe(
      tap((res) => {
        this.user.set(res.user);
        this.isAuthenticated.set(true);
        this._authChecked = true;
        this._initialCheckComplete = true;
        this.initComplete$.next(true);
        
        if (typeof window !== 'undefined' && (window as any).angularAppReady) {
          (window as any).angularAppReady();
        }
      }),
      catchError(() => {
        this.user.set(null);
        this.isAuthenticated.set(false);
        this._authChecked = true;
        this._initialCheckComplete = true;
        this.initComplete$.next(true);
        
        if (typeof window !== 'undefined' && (window as any).angularAppReady) {
          (window as any).angularAppReady();
        }
        return of(false);
      }),
      map(() => this.isAuthenticated())
    );
  }

  checkAuthStatus(): Observable<boolean> {
    return this.initializeAndGetAuthStatus();
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, { username, password }, { withCredentials: true })
      .pipe(
        tap((res) => {
          this.user.set(res.user);
          this.isAuthenticated.set(true);
          this._authChecked = true;
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.user.set(null);
        this.isAuthenticated.set(false);
        this._authChecked = false;
        this.router.navigate(['/auth/login']);
      })
    );
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }
}
