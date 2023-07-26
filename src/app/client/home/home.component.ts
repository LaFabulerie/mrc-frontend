import { Location } from '@angular/common';
import { AfterViewInit, Component, Injector, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BasketService } from 'src/app/services/basket.service';
import { RemoteControlService } from 'src/app/services/control.service';
import { environment } from 'src/environments/environment';
import { DisclaimerDialogComponent } from '../components/disclaimer-dialog/disclaimer-dialog.component';
import { VideoDialogComponent } from '../components/video-dialog/video-dialog.component';
import { ExitDialogComponent } from '../components/exit-dialog/exit-dialog.component';

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
  bgColor = '';
  titleColor = '';

  navigationModes = [
    {value: 'free', label: 'Libre'},
    {value: 'primary', label: 'Principal'},
    {value: 'secondary', label: 'Secondaire'},
  ]
  currentNavigationMode = 'free';
  mode = environment.mode;

  private mqtt : MqttService | undefined
  private currentOpennedDialog: DynamicDialogRef | null = null;

  constructor(
    private control: RemoteControlService,
    public basket: BasketService,
    private renderer: Renderer2,
    private router : Router,
    private location: Location,
    private dialogService: DialogService,
    private injector: Injector,
  ) {
    if(environment.mode === 'standalone' && environment.mqttBrokenHost) {
      this.mqtt = <MqttService>this.injector.get(MqttService);
    }

    const navigationMode = localStorage.getItem('navigationMode');
    if (navigationMode) {
      this.currentNavigationMode = navigationMode;
    }

  }

  ngAfterViewInit(): void {
    this.control.showMapButton$.subscribe(v => this.showMapButton = v);
    this.control.showBackButton$.subscribe(v => this.showBackButton = v);
    this.control.showListButton$.subscribe(v => this.showListButton = v);
    this.control.showExitButton$.subscribe(v => this.showExitButton = v);

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

      this.mqtt.observe('mrc/dialog').subscribe((message: IMqttMessage) => {
        if(this.currentNavigationMode === 'secondary') {
          const dialog = JSON.parse(message.payload.toString());
          if(dialog.name === 'close') {
            this.closeDialog(dialog.data);
          } else {
            this.openDialog(dialog);
          }
        }
      });
    }

    this.control.navigateTo$.subscribe(navData => {
      if(navData && this.currentNavigationMode !== 'secondary') {
        this.router.navigate(navData.url, {state: navData.state});
        if(this.mqtt) {
          this.mqtt.unsafePublish(`mrc/nav`, JSON.stringify({url: navData.url, state: navData.state || {}}), { qos: 1, retain: true });
        }
        this.control.stopNavigate()
      }
    });

    this.basket.basketSubject$.subscribe(basket => {
      if(this.mqtt && this.currentNavigationMode !== 'secondary') {
        this.mqtt.unsafePublish(`mrc/basket`, JSON.stringify(basket), { qos: 1, retain: true });
      }
    });

    this.control.dialog$.subscribe(dialog => {
      if(dialog && dialog.name != 'close' && this.currentNavigationMode !== 'secondary') {
        this.openDialog(dialog);

      } else {
        this.closeDialog(dialog ? dialog.data : null);
      }
      if(this.mqtt && this.currentNavigationMode !== 'secondary' && dialog) {
        this.mqtt.unsafePublish(`mrc/dialog`, JSON.stringify(dialog), { qos: 1, retain: true });
      }
    });
  }


  private openDialog(dialog: any) {
    let dialogClass: any;

    switch(dialog.name) {
      case 'DisclaimerDialogComponent':
        dialogClass = DisclaimerDialogComponent;
        break;
      case 'VideoDialogComponent':
        dialogClass = VideoDialogComponent;
        break;
      case 'ExitDialogComponent':
        dialogClass = ExitDialogComponent;
        break;
    }
    if(dialogClass){
      this.currentOpennedDialog = this.dialogService.open(dialogClass, {
        closable: false,
        maximizable: false,
        resizable: false,
        draggable: false,
        showHeader: false,
        data: dialog.data,
      });
      this.currentOpennedDialog.onClose.subscribe((next: string[]) => {
        this.currentOpennedDialog = null;
        this.closeDialog(next);
      });
    }
  }

  private closeDialog(next?: string[]) {
    if(this.currentOpennedDialog) {
      this.currentOpennedDialog.close();
    }
    if(next) {
      this.control.navigate(next)
    }

  }

  goToBasket() {
    this.control.navigate(['basket']);
  }

  navigationModeChange(){
    this.control.navigationMode = this.currentNavigationMode;
  }

  goToBack() {
    this.location.back()
    if(this.mqtt && this.control.navigationMode === 'primary') {
      this.mqtt.unsafePublish(`mrc/nav`, JSON.stringify({url: 'back', state: {}}), { qos: 1, retain: true });
    }
  }

  exit() {
    this.control.openDialog(ExitDialogComponent, {})
  }

  goToMap() {
    this.control.navigate(['map']);
  }






}
