import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://api.huizenbot.sanderfrentz.nl';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`);
  }

  getUserSearchConfigs(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${userId}/search-configs`);
  }

  createUser(user: any) {
    return this.http.post<{ user_id: number }>(`${this.apiUrl}/users`, user);
  }

  // Create search config for a user.
  createSearchConfig(userId: number, config: any) {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/search-configs`, config);
  }

  // Update user
  updateUser(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}`, data);
  }

  // Delete a search configuration by userId
  deleteSearchConfig(configId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/search-configs/${configId}`);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

}
