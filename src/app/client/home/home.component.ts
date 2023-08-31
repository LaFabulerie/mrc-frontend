import { Location } from '@angular/common';
import {Component, inject, Injector, OnInit, Renderer2} from '@angular/core';
import { Router } from '@angular/router';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BasketService } from 'src/app/services/basket.service';
import { RemoteControlService } from 'src/app/services/control.service';
import { environment } from 'src/environments/environment';
import { TurningTableDialogComponent } from '../components/turning-table-dialog/turning-table-dialog.component';
import { VideoDialogComponent } from '../components/video-dialog/video-dialog.component';
import { ExitDialogComponent } from '../components/exit-dialog/exit-dialog.component';
import {MessageService} from "primeng/api";
import { CoreService } from 'src/app/services/core.service';
import { Room } from 'src/app/models/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  basketCount = 0;
  executionMode = environment.executionMode;

  private readonly mqtt : MqttService | undefined
  private currentOpenedDialogs: {[Key : string]: DynamicDialogRef} = {};

  currentRoom: Room|null = null;

  constructor(
    public control: RemoteControlService,
    public basket: BasketService,
    private renderer: Renderer2,
    private router : Router,
    private location: Location,
    private dialogService: DialogService,
    private messageService: MessageService,
    private coreService: CoreService,
  ) {
    if(this.executionMode === 'standalone' && environment.mqttBrokenHost) {
      this.mqtt = inject(MqttService);
    }
  }

  ngOnInit(): void {

    this.coreService.loadRooms();
    this.coreService.loadItems();
    this.coreService.loadDigitalUses();

    this.coreService.rooms$.subscribe(rooms => {
      this.currentRoom = rooms.find(room => room.position == 0) || null;
    });

    if(this.mqtt) {
      this.mqtt.observe('mrc/mode').subscribe((message: IMqttMessage) => {
        const data = JSON.parse(message.payload.toString());
        if(data.type === 'RESP') {
          if(data.uniqueId === this.control.uniqueId) {
            if(data.value === 'OK') {
              this.control.navigationMode = data.mode;
              this.control.navigate(['door']);
            } else { //data.value === 'KO'
              this.messageService.add({
                severity:'error',
                summary:'Error',
                detail: 'Un autre utilisateur utilise déjà la Maison (Re)Connecté en mode «libre».',
              });
            }
          }
          else {//data.uniqueId !== this.control.uniqueId
            if(data.value === 'OK' && data.mode === 'primary') {
              this.control.navigationMode = 'secondary';
              this.control.navigate(['door']);
            }
          }
        } else if(data.type === 'RST') {
          this.control.navigationMode = null;
        }
      });

      this.mqtt.observe('mrc/nav').subscribe((message: IMqttMessage) => {
        if(this.control.navigationMode === 'secondary') { //to be sure but only secondary should receive this
          const nav = JSON.parse(message.payload.toString());

          if(nav.url[0] === 'back') {
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

      this.mqtt.observe('mrc/position').subscribe((message: IMqttMessage) => {
        if(this.control.navigationMode !== 'secondary') {
          const resp = JSON.parse(message.payload.toString());
          this.control.closeDialog(TurningTableDialogComponent, ['room', resp.room, resp.uuid]);
        }
      });
    }

    this.control.bgColor$.subscribe(v => this.renderer.setStyle(document.body, 'background-color', v));

    this.basket.basketSubject$.subscribe(_ => this.basketCount = this.basket.count());

    this.control.navigateTo$.subscribe(navData => {
      if(navData && this.control.navigationMode !== 'secondary') {
        this.router.navigate(navData.url, {state: navData.state});
        if(this.mqtt) {
          this.mqtt.unsafePublish(`mrc/nav`, JSON.stringify({url: navData.url, state: navData.state || {}}), { qos: 1, retain: false });
        }
        this.control.stopNavigate()
      }
    });

    this.basket.basketSubject$.subscribe(basket => {
      if(this.mqtt && this.control.navigationMode !== 'secondary') {
        this.mqtt.unsafePublish(`mrc/basket`, JSON.stringify(basket), { qos: 1, retain: false });
      }
    });

    this.basket.printBasket$.subscribe(payload => {
      if(this.mqtt && this.control.navigationMode !== 'secondary' && this.executionMode === 'standalone' && payload) {
        this.mqtt.unsafePublish(`mrc/print`, JSON.stringify(payload), { qos: 1, retain: false });
      }
    });

    this.control.currentRoom$.subscribe(room => {
      if(this.mqtt && this.control.navigationMode !== 'secondary' && this.executionMode === 'standalone' && room) {
        this.coreService.getDistanceBetweenRooms(this.currentRoom!, room).subscribe((resp: any) => {
          this.mqtt!.unsafePublish(`mrc/rotate`, JSON.stringify({
            uuid: resp.uuid,
            slug: resp.slug,
            distance: resp.distance,
          }), { qos: 1, retain: false });
        });
      }
    });

    this.control.currentItem$.subscribe(item => {
      if(this.mqtt && this.control.navigationMode !== 'secondary' && this.executionMode === 'standalone') {
        this.mqtt.unsafePublish(`mrc/item`, JSON.stringify(item), { qos: 1, retain: false });
      }
    });

    this.control.dialog$.subscribe(dialog => {
      if(dialog && this.control.navigationMode !== 'secondary'){
        if(dialog.action === 'open') {
          this.openDialog(dialog);
        } else {
          this.closeDialog(dialog);
        }
        if(this.mqtt) {
          this.mqtt.unsafePublish(`mrc/dialog`, JSON.stringify(dialog), { qos: 1, retain: false });
        }
      }

    });
  }


  private openDialog(dialog: any) {
    let dialogClass: any;

    switch(dialog.name) {
      case 'TurningTableDialogComponent':
        dialogClass = TurningTableDialogComponent;
        break;
      case 'VideoDialogComponent':
        dialogClass = VideoDialogComponent;
        break;
    }
    if(dialogClass){
      this.currentOpenedDialogs[dialogClass.name] = this.dialogService.open(dialogClass, {
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
    if(this.currentOpenedDialogs.hasOwnProperty(dialog.name)) {
      this.currentOpenedDialogs[dialog.name].close(dialog.next);
      delete this.currentOpenedDialogs[dialog.name];
    }
    if(dialog.data.next) {
      this.control.navigate(dialog.data.next)
    }

  }

  goToBasket() {
    this.control.navigate(['basket']);
  }

  goToBack() {
    this.location.back()
    if(this.mqtt && this.control.navigationMode !== 'secondary') {
      this.mqtt.unsafePublish(`mrc/nav`, JSON.stringify({url: ['back'], state: {}}), { qos: 1, retain: false });
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
    ref.onClose.subscribe((resp) => {
      if(resp === true) {
        this.basket.clear();
        localStorage.clear();
        this.control.navigationMode = null;
        this.control.navigate(['/']);
        if(this.mqtt && this.control.navigationMode !== 'secondary') {
          this.mqtt.unsafePublish(`mrc/mode`, JSON.stringify({
            mode: this.control.navigationMode,
            uniqueId: this.control.uniqueId,
            type: 'RST',
          }), { qos: 1, retain: false });
        }
      } else if(resp[0] === 'basket') {
        this.control.navigate(['basket']);
      }
    });
  }

  goToMap() {
    this.control.navigate(['map']);
  }
}
