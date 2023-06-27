import { Location } from '@angular/common';
import { AfterViewInit, Component, Injector, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { BasketService } from 'src/app/services/basket.service';
import { RemoteControlService } from 'src/app/services/control.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{

  showMapButton = false;
  showBackButton = false;
  showListButton = false;
  showExitButton = false;
  showLogo = true;
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

  private mqtt : MqttService | undefined

  constructor(
    private control: RemoteControlService,
    public basket: BasketService,
    private renderer: Renderer2,
    private router : Router,
    private location: Location,
    private injector: Injector,
  ) {
    if(environment.mode === 'standalone' && environment.mqttBrokenHost) {
      this.mqtt = <MqttService>this.injector.get(MqttService);
    }

    const navigationMode = localStorage.getItem('navigationMode');
    if (navigationMode) {
      this.currentNavigationMode = navigationMode;
    }

  // }

  // ngAfterViewInit(): void {
    this.control.showMapButton$.subscribe(v => this.showMapButton = v);
    this.control.showBackButton$.subscribe(v => this.showBackButton = v);
    this.control.showListButton$.subscribe(v => this.showListButton = v);
    this.control.showExitButton$.subscribe(v => this.showExitButton = v);

    this.control.navigationBgColor$.subscribe(v => this.navigationBgColor = v);
    this.control.showLogo$.subscribe(v => this.showLogo = v);
    this.control.title$.subscribe(v => this.title = v);
    this.control.bgColor$.subscribe(v => this.renderer.setStyle(document.body, 'background-color', v));
    this.control.titleColor$.subscribe(v => this.titleColor = v);
    this.basket.basketSubject$.subscribe(_ => this.basketCount = this.basket.count());



    this.control.navigationMode$.subscribe(modeValue => {
      if(this.mqtt && this.currentNavigationMode !== 'secondary') {
        this.mqtt.unsafePublish(`mrc/mode`, modeValue, { qos: 1, retain: true });
        this.basket.refresh();
      }
    });

    if(this.mqtt) {
      this.mqtt.observe('mrc/mode').subscribe((message: IMqttMessage) => {
        const modeValue = message.payload.toString();
        if(modeValue !== this.currentNavigationMode) {
          if(this.currentNavigationMode === 'secondary' && modeValue === 'free') {
            this.basket.clear();
          }
          this.currentNavigationMode = modeValue === 'primary' ? 'secondary' : 'free';
          this.control.navigationMode = this.currentNavigationMode;

        }
      });

      this.mqtt.observe('mrc/nav').subscribe((message: IMqttMessage) => {
        if(this.currentNavigationMode === 'secondary') { //to be sure but only secondary should receive this
          const nav = JSON.parse(message.payload.toString());

          if(nav.url === 'back') {
            this.location.back();
            return;
          }
          this.router.navigate(nav.url, {state: nav.state});
        }
      });

      this.mqtt.observe('mrc/basket').subscribe((message: IMqttMessage) => {
        if(this.currentNavigationMode === 'secondary') {
          const basket = JSON.parse(message.payload.toString());
          this.basket.load(basket);
        }
      });
    }

    this.control.navigateTo$.subscribe(navData => {
      if(navData && this.currentNavigationMode !== 'secondary') {
        this.router.navigate(navData.url, {state: navData.state});
        if(this.mqtt) {
          this.mqtt.unsafePublish(`mrc/nav`, JSON.stringify({url: navData.url, state: navData.state || {}}), { qos: 1, retain: true });
        }
      }
    });

    this.basket.basketSubject$.subscribe(basket => {
      if(this.mqtt && this.currentNavigationMode !== 'secondary') {
        this.mqtt.unsafePublish(`mrc/basket`, JSON.stringify(basket), { qos: 1, retain: true });
      }
    });

  }

  goToBasket() {
    this.control.navigate(['basket']);
  }

  navigationModeChange(){
    this.control.navigationMode = this.currentNavigationMode;
  }

  goBack() {
    this.location.back()
    if(this.mqtt && this.control.navigationMode === 'primary') {
      this.mqtt.unsafePublish(`mrc/nav`, JSON.stringify({url: 'back', state: {}}), { qos: 1, retain: true });
    }
  }

  goHome() {
    this.control.navigate(['door']);
  }

  goMap() {
    this.control.navigate(['map']);
  }







}
