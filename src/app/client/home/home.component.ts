import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { BasketService } from 'src/app/services/basket.service';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit{

  showControls = false;
  showLogo = true;
  backUrl = '';
  title = '';
  basketCount = 0;
  navigationBgColor = '';
  bgColor = '';
  titleColor = '';

  navigationModes = [
    {value: 'free', label: 'Libre'},
    {value: 'primary', label: 'Principal'},
    {value: 'secondary', label: 'Secondaire'},
  ]
  currentNavigationMode = 'free';

  constructor(
    private control: RemoteControlService,
    public basket: BasketService,
    private router: Router,
    private renderer: Renderer2
  ) {

  }

  ngAfterViewInit(): void {
    this.control.showControls$.subscribe(v => this.showControls = v);
    this.control.navigationBgColor$.subscribe(v => this.navigationBgColor = v);
    this.control.logoVisible$.subscribe(v => this.showLogo = v);
    this.control.currentBackUrl$.subscribe(v => this.backUrl = v);
    this.control.title$.subscribe(v => this.title = v);
    this.control.bgColor$.subscribe(v => this.renderer.setStyle(document.body, 'background-color', v));
    this.control.titleColor$.subscribe(v => this.titleColor = v);
    this.basket.basketSubject$.subscribe(_ => this.basketCount = this.basket.count());

    this.control.navigateTo$.subscribe(navData => {
      if(!navData) return;
      this.router.navigate(navData.url, {state: navData.state});
    });

    this.control.navigationMode$.subscribe(v => {
      this.currentNavigationMode = v;
    });
  }

  goToBasket() {
    const url = ['basket']
    const state = { back: this.router.url }
    this.control.navigateTo(url, state);
    this.router.navigate(['basket'], { state: state });
  }

  navigationModeChange(){
    this.control.navigationMode = this.currentNavigationMode;
  }

  goBack() {
    this.router.navigateByUrl(this.backUrl);
  }







}
