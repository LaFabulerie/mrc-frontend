import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userSubject: BehaviorSubject<User | undefined>;
  public user$: Observable<User | undefined>;

  constructor(
    private http: HttpClient,
  ) {
    this.userSubject = new BehaviorSubject<User | undefined>(undefined);
    this.user$ = this.userSubject.asObservable();
  }

  public get currentUser() {
    if (this.userSubject.value) {
      return this.userSubject.value;
    } else if (localStorage.getItem('user')) {
      const userData = JSON.parse(localStorage.getItem('user')!);
      const user = new User(userData);
      this.userSubject.next(user);
      return user;
    }
    return undefined;
  }

  updateCurrentUser(data: any) {
    return this.http.patch<User>(`${environment.serverHost}/api/user/${this.currentUser!.id}/`, data)
    .pipe(
      map(userData => {
        localStorage.setItem('user', JSON.stringify(userData));
        const user = new User(userData);
        this.userSubject.next(user);
        return user;
      })
    );
  }

  private storeToken(tokenName: string, tokenValue: string) {
    localStorage.setItem(tokenName, tokenValue);
  }

  getToken(tokenName: string) {
    if(localStorage.getItem(tokenName)) {
      return localStorage.getItem(tokenName)!;
    }
    return "";
  }

  private _processLogin(response: any) {
    const userData = response.user;
    localStorage.setItem('user', JSON.stringify(userData));
    this.storeToken('refreshToken', response.refresh);
    this.storeToken('accessToken', response.access);
    const user = new User(userData);
    this.userSubject.next(user);
    this.startRefreshTokenTimer(response.access);
    return user;
  }

  signin(data: any): Observable<any> {
    return this.http.post<any>(`${environment.serverHost}/api/auth/login/`, data)
    .pipe(
      map(resp => this._processLogin(resp))
    );
  }

  logout() {
    console.warn("logout")
    this.stopRefreshTokenTimer();
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    this.userSubject.next(undefined);
  }

  refreshToken() {
    const refresh = this.getToken('refreshToken');
    return this.http.post<any>(`${environment.serverHost}/api/auth/token/refresh/`, {refresh: refresh})
    .pipe(
      map((resp) => {
        this.storeToken('accessToken', resp.access);
        this.startRefreshTokenTimer(resp.access);
        return this.currentUser;
      })
    );
}

  signup(data: any): Observable<any> {
    return this.http.post(`${environment.serverHost}/api/auth/signup/`, data).pipe(
        map(resp => this._processLogin(resp))
      );
  }

  verifyEmail(key: string): Observable<any> {
    return this.http.post(
      `${environment.serverHost}/api/auth/signup/verify-email/`,
      { key: key }
    );
  }

  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post(
      `${environment.serverHost}/api/auth/signup/resend-email/`,
      { email: email }
    );
  }

  resetPwd(email: string): Observable<any> {
    return this.http.post(
      `${environment.serverHost}/api/auth/password/reset/`,
      { email: email }
    );
  }

  resetPwdConfirm(data: any): Observable<any> {
    return this.http.post(
      `${environment.serverHost}/api/auth/password/reset/confirm/`,
      data
    );
  }

  private refreshTokenTimeout: any;

  private startRefreshTokenTimer(token: string) {
    this.stopRefreshTokenTimer();

    const decodedToken: any = jwt_decode(token);
    const expires = new Date(decodedToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    if(this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
}
