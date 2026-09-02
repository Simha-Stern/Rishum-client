import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import type { AuthenticationResult, CurrentSession, InstitutionRole, UserProfile } from '../models/auth';

const tokenStorageKey = 'rishum_plus_session_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly sessionState = signal<CurrentSession | null>(null);
  private readonly restoredState = signal(false);

  readonly session = this.sessionState.asReadonly();
  readonly isRestored = this.restoredState.asReadonly();
  readonly user = computed(() => this.sessionState()?.user ?? null);

  restoreSession() {
    if (!this.getToken()) {
      this.restoredState.set(true);
      return of(null);
    }
    return this.http.get<CurrentSession>('/api/me').pipe(
      tap((session) => this.sessionState.set(session)),
      catchError(() => {
        this.clearSession();
        return of(null);
      }),
      tap(() => this.restoredState.set(true)),
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthenticationResult>('/api/auth/login', { email, password }).pipe(
      switchMap((result) => this.storeAuthentication(result)),
    );
  }

  register(input: { email: string; password: string; firstName: string; lastName: string; phone?: string; idNumber?: string }) {
    return this.http.post<AuthenticationResult>('/api/auth/register', input).pipe(
      switchMap((result) => this.storeAuthentication(result)),
    );
  }

  logout() {
    return this.http.post<void>('/api/auth/logout', {}).pipe(
      catchError(() => of(undefined)),
      tap(() => this.clearSession()),
    );
  }

  updateProfile(input: Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'phone' | 'idNumber'>>) {
    return this.http.patch<UserProfile>('/api/me/profile', input).pipe(
      tap((user) => this.sessionState.update((session) => session ? { ...session, user } : session)),
    );
  }

  hasInstitutionRole(institutionId: string, role: InstitutionRole): boolean {
    const session = this.sessionState();
    return !!session && session.memberships.some((membership) => membership.institutionId === institutionId && membership.role === role);
  }

  getToken(): string | null {
    return localStorage.getItem(tokenStorageKey);
  }

  private storeAuthentication(result: AuthenticationResult) {
    localStorage.setItem(tokenStorageKey, result.token);
    return this.http.get<CurrentSession>('/api/me').pipe(tap((session) => {
      this.sessionState.set(session);
      this.restoredState.set(true);
    }));
  }

  private clearSession(): void {
    localStorage.removeItem(tokenStorageKey);
    this.sessionState.set(null);
    this.restoredState.set(true);
  }
}
