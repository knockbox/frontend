import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserResponse} from "../lib/responses";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {
  }

  getUserByUsername(username: string): Observable<UserResponse> {
    const endpoint = `${environment.authApiUrl}/user/username/${username}`;
    return this.http.get<UserResponse>(endpoint);
  }

  getLikeUsername(username: string): Observable<UserResponse[] | null> {
    const endpoint = `${environment.authApiUrl}/user/search/${username}`;
    return this.http.get<UserResponse[] | null>(endpoint);
  }

  getByAccountId(account_id: string): Observable<UserResponse> {
    const endpoint = `${environment.authApiUrl}/user/${account_id}`;
    return this.http.get<UserResponse>(endpoint);
  }
}
