import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {TokenService} from "./token.service";
import {JwtHelperService} from '@auth0/angular-jwt';
import {LoginInput, RegisterInput} from "../lib/inputs";
import {TokenResponse} from "../lib/responses";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject(false);
  public isLoggedIn = this._isLoggedIn;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    const token = tokenService.getToken();
    if (!token) {
      this.setLoggedIn(false);
    }

    this.setLoggedIn(!new JwtHelperService().isTokenExpired(token))
  }

  /**
   * Update the logged in status.
   * @param value
   */
  setLoggedIn(value: boolean): void {
    this._isLoggedIn.next(value);
  }

  /**
   * Login with a username and password.
   * @param input
   */
  login(input: LoginInput): Observable<TokenResponse> {
    const endpoint = `${environment.authApiUrl}/login`;
    return this.http.post<TokenResponse>(endpoint, input);
  }

  /**
   * Register with a username, password and email.
   * @param input
   */
  register(input: RegisterInput): Observable<void> {
    const endpoint = `${environment.authApiUrl}/register`;
    return this.http.post<void>(endpoint, input);
  }

  /**
   * Get the username from the token.
   */
  getUsername(): string | null {
    const token = this.tokenService.getToken();
    if (!token) return null;

    const decodedToken = new JwtHelperService().decodeToken(token);
    return decodedToken["username"];
  }

  /**
   * Get the account_id from the token.
   */
  getAccountId(): string | null {
    const token = this.tokenService.getToken();
    if (!token) return null;

    const decodedToken = new JwtHelperService().decodeToken(token);
    return decodedToken["account_id"];
  }

  /**
   * Get the account_id from the token.
   */
  getRole(): string | null {
    const token = this.tokenService.getToken();
    if (!token) return null;

    const decodedToken = new JwtHelperService().decodeToken(token);
    return decodedToken["role"];
  }
}
