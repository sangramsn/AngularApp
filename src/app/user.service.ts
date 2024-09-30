import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './Interface/userInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:44347/api/Users';

  constructor(private http: HttpClient) {}
  getUserRole(): string | null {
    const user = JSON.parse(localStorage.getItem('userToken') || '{}');
    return user.role || null;
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  deleteUser(id: string) {
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }
  editUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }
}
