import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import  *  as CryptoJS from  'crypto-js';
import jwt_decode from 'jwt-decode';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userSubject: BehaviorSubject<User | undefined>;
  public user$: Observable<User | undefined>;
  clientMode = environment.mode === 'client';

  constructor(
    private http: HttpClient,
  ) {
    this.userSubject = new BehaviorSubject<User | undefined>(undefined);
    this.user$ = this.userSubject.asObservable();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, environment.cryptoKey).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, environment.cryptoKey).toString(CryptoJS.enc.Utf8);
  }

  public get userValue() {
    if (this.userSubject.value) {
      return this.userSubject.value;
    } else if (localStorage.getItem('user')) {
      const userData = JSON.parse(this.decrypt(localStorage.getItem('user')!));
      const user = new User(userData);
      this.userSubject.next(user);
      return user;
    }
    return undefined;
  }

  updateCurrentUser(data: any) {
    return this.http.patch<User>(`${environment.apiHost}/api/user/${this.userValue!.id}/`, data)
    .pipe(
      map(userData => {
        localStorage.setItem('user', this.encrypt(JSON.stringify(userData)));
        const user = new User(userData);
        this.userSubject.next(user);
        return user;
      })
    );
  }

  private storeToken(tokenName: string, tokenValue: string) {
    localStorage.setItem(tokenName, this.encrypt(tokenValue));
  }

  getToken(tokenName: string) {
    if(localStorage.getItem(tokenName)) {
      return this.decrypt(localStorage.getItem(tokenName)!);
    }
    return "";
  }

  private _processLogin(response: any) {
    console.log("Process Login")
    const userData = response.user;
    localStorage.setItem('user', this.encrypt(JSON.stringify(userData)));
    this.storeToken('refreshToken', response.refreshToken);
    this.storeToken('accessToken', response.accessToken);
    const user = new User(userData);
    this.userSubject.next(user);
    this.startRefreshTokenTimer(response.accessToken);
    return user;
  }

  signin(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiHost}/api/auth/login/`, data)
    .pipe(
      map(resp => this._processLogin(resp))
    );
  }

  logout() {
    this.stopRefreshTokenTimer();
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    this.userSubject.next(undefined);
  }

  refreshToken() {
    const refresh = this.getToken('refreshToken');
    return this.http.post<any>(`${environment.apiHost}/api/auth/token/refresh/`, {refresh: refresh})
    .pipe(
      map((resp) => {
        this.storeToken('accessToken', resp.access);
        this.startRefreshTokenTimer(resp.access);
        return this.userValue;
      })
    );
}

  signup(data: any): Observable<any> {
    let resp =  this.http.post(`${environment.apiHost}/api/auth/signup/`, data);
    if(this.clientMode) {
      resp = resp.pipe(
        map(resp => this._processLogin(resp))
      );
    }
    return resp
  }

  verifyEmail(key: string): Observable<any> {
    return this.http.post(
      `${environment.apiHost}/api/auth/signup/verify-email/`,
      { key: key }
    );
  }

  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post(
      `${environment.apiHost}/api/auth/signup/resend-email/`,
      { email: email }
    );
  }

  resetPwd(email: string): Observable<any> {
    return this.http.post(
      `${environment.apiHost}/api/auth/password/reset/`,
      { email: email }
    );
  }

  resetPwdConfirm(data: any): Observable<any> {
    return this.http.post(
      `${environment.apiHost}/api/auth/password/reset/confirm/`,
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
