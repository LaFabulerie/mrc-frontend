import {CanActivateFn, Router} from '@angular/router';
import {RemoteControlService} from "../services/control.service";
import {environment} from "../../environments/environment";
import {inject} from "@angular/core";

export const navigationModeGuard: CanActivateFn = (_route, _state) => {
  if(environment.executionMode === 'standalone') {
    const control = inject(RemoteControlService);
    const router = inject(Router);
    if(control.navigationMode == null) {
      return router.parseUrl('/mode');
    }
  }
  return true;
};
