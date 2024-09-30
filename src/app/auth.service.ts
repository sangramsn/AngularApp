import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  [x: string]: any;
  private apiUrl = 'https://localhost:44347/api/Users/login';
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    console.log(email);
    console.log(password);

    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap((res) => {
        if (res && res.token) {
          console.log(res.token);
          localStorage.setItem('token', res.token);
          this.currentUserSubject.next(res);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user && user.role === 'admin';
  }
  isUser(): boolean {
    const user = this.currentUserSubject.value;
    return user && user.role === 'user';
  }
}
