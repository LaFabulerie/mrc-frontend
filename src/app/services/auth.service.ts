import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/user';
import  *  as CryptoJS from  'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | undefined>;
  public user: Observable<User | undefined>;

  constructor(
    private http: HttpClient,
    private router: Router,

  ) {
    this.userSubject = new BehaviorSubject<User | undefined>(undefined);
    this.user = this.userSubject.asObservable();
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
      const user = JSON.parse(this.decrypt(localStorage.getItem('user')!));
      this.userSubject.next(user);
      return user;
    }
    return undefined;
  }

  signin(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiHost}/api/auth/login/`, data, { withCredentials: true })
    .pipe(
      map(resp => {
        const user = resp.user;
        user.jwtToken = resp.accessToken;
        localStorage.setItem('user', this.encrypt(JSON.stringify(user)));
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      })
    );
  }

  logout() {
    this.stopRefreshTokenTimer();
    localStorage.removeItem('user');
    this.userSubject.next(undefined);
    this.router.navigate(['/auth/signin']);
  }

  refreshToken() {
    return this.http.post<any>(`${environment.apiHost}/api/auth/token/refresh/`, {}, { withCredentials: true })
    .pipe(
      map((resp) => {
        const user = {
          id: this.userValue!.id,
          email: this.userValue!.email,
          username: this.userValue!.username,
          firstName: this.userValue!.firstName,
          lastName: this.userValue!.lastName,
          jwtToken: resp.accessToken,
        };
        localStorage.setItem('user', this.encrypt(JSON.stringify(user)));
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        return user;
      })
    );
}

  signup(data: any): Observable<any> {
    return this.http.post(`${environment.apiHost}/api/auth/signup/`, data);
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

  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtBase64 = this.userValue!.jwtToken!.split('.')[1];
    const jwtToken = JSON.parse(atob(jwtBase64));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
