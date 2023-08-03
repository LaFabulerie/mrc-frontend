import { Location } from '@angular/common';
import { Component, Injector, Renderer2 } from '@angular/core';
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

  basketCount = 0;
  isPrimary = false;
  mode = environment.mode;

  private mqtt : MqttService | undefined
  private currentOpennedDialogs: {[Key : string]: DynamicDialogRef} = {};

  constructor(
    public control: RemoteControlService,
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
  }

  ngAfterViewInit(): void {
    this.control.bgColor$.subscribe(v => this.renderer.setStyle(document.body, 'background-color', v));
    this.basket.basketSubject$.subscribe(_ => this.basketCount = this.basket.count());


    this.control.navigationMode$.subscribe(modeValue => {
      if(this.mqtt && this.control.navigationMode !== 'secondary') {
        this.mqtt.unsafePublish(`mrc/mode`, modeValue, { qos: 1, retain: true });
        this.basket.refresh();
      }
    });

    if(this.mqtt) {
      this.mqtt.observe('mrc/mode').subscribe((message: IMqttMessage) => {
        const modeValue = message.payload.toString();
        if(modeValue !== this.control.navigationMode) {
          if(this.control.navigationMode === 'secondary' && modeValue === 'free') {
            this.basket.clear();
          }
          this.control.navigationMode = modeValue === 'primary' ? 'secondary' : 'free';

        }
      });

      this.mqtt.observe('mrc/nav').subscribe((message: IMqttMessage) => {
        if(this.control.navigationMode === 'secondary') { //to be sure but only secondary should receive this
          const nav = JSON.parse(message.payload.toString());

          if(nav.url === 'back') {
            this.location.back();
            return;
          }
          this.router.navigate(nav.url, {state: nav.state});
        }
      });

      this.mqtt.observe('mrc/basket').subscribe((message: IMqttMessage) => {
        if(this.control.navigationMode === 'secondary') {
          const basket = JSON.parse(message.payload.toString());
          this.basket.load(basket);
        }
      });

      this.mqtt.observe('mrc/dialog').subscribe((message: IMqttMessage) => {
        if(this.control.navigationMode === 'secondary') {
          const dialog = JSON.parse(message.payload.toString());
          if(dialog.action === 'close') {
            this.closeDialog(dialog);
          } else {
            this.openDialog(dialog);
          }
        }
      });
    }

    this.control.navigateTo$.subscribe(navData => {
      if(navData && this.control.navigationMode !== 'secondary') {
        this.router.navigate(navData.url, {state: navData.state});
        if(this.mqtt) {
          this.mqtt.unsafePublish(`mrc/nav`, JSON.stringify({url: navData.url, state: navData.state || {}}), { qos: 1, retain: true });
        }
        this.control.stopNavigate()
      }
    });

    this.basket.basketSubject$.subscribe(basket => {
      if(this.mqtt && this.control.navigationMode !== 'secondary') {
        this.mqtt.unsafePublish(`mrc/basket`, JSON.stringify(basket), { qos: 1, retain: true });
      }
    });

    this.basket.printBasket$.subscribe(payload => {
      if(this.mqtt && this.control.navigationMode !== 'secondary' && environment.mode === 'standalone' && payload) {
        this.mqtt.unsafePublish(`mrc/print`, JSON.stringify(payload), { qos: 1, retain: true });
      }
    });

    this.control.dialog$.subscribe(dialog => {
      if(dialog && this.control.navigationMode !== 'secondary'){
        if(dialog.action === 'open' ) {
          this.openDialog(dialog);
        } else {
          console.log('dialog$ notif => closeDialog', dialog)
          this.closeDialog(dialog);
        }
      }
      if(this.mqtt && this.isPrimary && dialog) {
        console.log('dialog$ notif => mqtt', dialog)
        this.mqtt.unsafePublish(`mrc/dialog`, JSON.stringify(dialog), { qos: 1, retain: true });
      }
    });
  }


  private openDialog(dialog: any) {
    console.log('openDialog', dialog)
    let dialogClass: any;

    switch(dialog.name) {
      case 'DisclaimerDialogComponent':
        dialogClass = DisclaimerDialogComponent;
        break;
      case 'VideoDialogComponent':
        dialogClass = VideoDialogComponent;
        break;
    }
    if(dialogClass){
      this.currentOpennedDialogs[dialogClass.name] = this.dialogService.open(dialogClass, {
        closable: false,
        maximizable: false,
        resizable: false,
        draggable: false,
        showHeader: false,
        data: dialog.data,
      });
    }
  }

  private closeDialog(dialog: any) {
    if(this.currentOpennedDialogs.hasOwnProperty(dialog.name)) {
      this.currentOpennedDialogs[dialog.name].close(dialog.next);
      delete this.currentOpennedDialogs[dialog.name];
    }
    if(dialog.data.next) {
      this.control.navigate(dialog.data.next)
    }

  }

  goToBasket() {
    this.control.navigate(['basket']);
  }

  navigationModeChange(){
    this.control.navigationMode = this.isPrimary ? 'primary' : 'free';
    this.goToMap();
  }

  goToBack() {
    this.location.back()
    if(this.mqtt && this.control.navigationMode === 'primary') {
      this.mqtt.unsafePublish(`mrc/nav`, JSON.stringify({url: 'back', state: {}}), { qos: 1, retain: true });
    }
  }

  exit() {
    let ref = this.dialogService.open(ExitDialogComponent, {
      closable: false,
      maximizable: false,
      resizable: false,
      draggable: false,
      showHeader: false,
    });
    ref.onClose.subscribe(() => {
      this.control.navigate(['door']);
    });
  }

  goToMap() {
    this.control.navigate(['map']);
  }






}
