import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { BasketService } from 'src/app/services/basket.service';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit{

  user?: User;
  showControls = false;
  transparentControls = false;
  showLogo = true;
  navigationMode = "free";
  backUrl = '';
  title = '';
  basketCount = 0;

  constructor(
    private control: RemoteControlService,
    public basket: BasketService,
    private router: Router,
  ) {

  }

  ngAfterViewInit(): void {
    this.control.showControls$.subscribe((v) => {
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

    this.control.currentBackUrl$.subscribe(v => {
      this.backUrl = v;
    });

    this.control.title$.subscribe(v => {
      this.title = v;
    });

    this.basket.basketSubject$.subscribe(_ => {
      this.basketCount = this.basket.count();
    });
  }

  goToBasket() {
    this.router.navigateByUrl('/basket', { state: { back: this.router.url } });
  }

  switchNavigationMode(){
    this.control.switchNavigationMode(this.navigationMode);
  }

  goToMap(){
    this.router.navigateByUrl('/map');
  }







}
