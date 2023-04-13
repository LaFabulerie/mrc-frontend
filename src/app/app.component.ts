import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  user?: User | null;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    this.authService.user$.subscribe((x) => (this.user = x));
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.translateService.setDefaultLang('fr');
  }
}
