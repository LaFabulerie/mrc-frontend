import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

export function appInitializer(authService: AuthService) {
    return () => authService.refreshToken()
        .pipe(

            catchError((err) => {
              return of()
            })
        );
}
