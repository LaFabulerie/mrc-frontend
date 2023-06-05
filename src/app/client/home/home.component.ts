import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-door',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit{

  user?: User;
  showControls = false;
  transparentControls = false;
  showLogo = true;
  navigationMode = "free";

  constructor(
    private authService: AuthService,
    private control: RemoteControlService,
    private router: Router,
  ) {

  }

  ngAfterViewInit(): void {
    this.authService.user$.subscribe((x) => {
      this.user = x;
    });

    this.control.activatedNavigation$.subscribe((v) => {
      this.showControls = v
    });
    this.control.transparentNavigation$.subscribe((v) => {
      this.transparentControls = v
    });
    this.control.logoVisible$.subscribe((v) => {
      this.showLogo = v
    });

    this.control.navigateToDoor$.subscribe(v => {
      if(!v) return;
      this.router.navigateByUrl('/door');
    });
  }

  switchNavigationMode(){
    this.control.switchNavigationMode(this.navigationMode);
  }

  goToMap(){
    this.router.navigateByUrl('/map');
  }







}
