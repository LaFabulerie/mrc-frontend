import {CanActivateFn, Router} from '@angular/router';
import {environment} from "../../environments/environment";
import {inject} from "@angular/core";

export const standaloneGuard: CanActivateFn = (_route, _state) => {
  if(environment.executionMode === 'standalone'){
    return true;
  }
  const router = inject(Router);
  return router.parseUrl('/');
};
