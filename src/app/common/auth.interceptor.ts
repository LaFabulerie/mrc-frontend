import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.authService.userValue;
        if (user) {
            const token = this.authService.getToken('accessToken');
            request = request.clone({
                setHeaders: { Authorization: `Bearer  ${token}` }
            });
        } else {
            request = request.clone({
                setHeaders: { Authorization: `Api-Key ${environment.apiKey}` }
            });
        }


        return next.handle(request);
    }
}
