import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from './models/user';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [
    Title
  ]
})
export class AppComponent implements OnInit {
  user?: User | null;

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService,
    private translateService: TranslateService,
    private title: Title,
  ) {
    this.authService.user$.subscribe((x) => (this.user = x));
    if(environment.mode === 'client') {
      this.title.setTitle('Client');
    } else {
      this.title.setTitle('Admin');
    }
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.translateService.setDefaultLang('fr');
  }
}
