import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {
  }

  /**
   * Clear the session.
   */
  logout(): void {
    localStorage.removeItem("access_token");
  }

  /**
   * Write the token to session storage.
   * @param token
   */
  public saveToken(token: string): void {
    localStorage.setItem("access_token", token);
  }

  /**
   * Read the token from session storage.
   */
  public getToken(): string | null {
    return localStorage.getItem("access_token");
  }
}
