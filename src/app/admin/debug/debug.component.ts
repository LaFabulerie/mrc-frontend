import { Component, OnInit, inject } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { Item, Room } from 'src/app/models/core';
import { CoreService } from 'src/app/services/core.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit{

  rooms: Room[] = []
  lightValues: {[Key: string]: boolean} = {}
  motorValue = true
  canRotate = true
  currentRoom: Room|null = null
  mqtt?: MqttService;

  brakeOptions = [
    { label: 'Backward', value: "on", direction: -1 },
    { label: 'OFF', value: "off", direction: 0 },
    { label: 'Forward', value: "on", direction: 1 },
  ];

  showItemLightDialog = false;

  itemLightForm: FormGroup
  currentEditingItem: Item|null = null;

  constructor(
    private coreService: CoreService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    if(!environment.mqttBrokerHost || environment.houseless) {
      this.router.navigate(['/admin']);
    }

    this.mqtt = inject(MqttService);
    this.itemLightForm = this.fb.group({
      lightCtrl: ['', [Validators.required]],
      lightPin: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.coreService.rooms$.subscribe((rooms: Room[]) => {
      this.rooms = rooms;
      this.currentRoom = this.rooms.find(room => room.slug == 'jardin') || null;
      this.rooms.forEach(room => {
        this.lightValues[room.uuid] = false
        room.items.forEach(item => this.lightValues[item.uuid] = false)
      });
    });


    if(this.mqtt){
      this.mqtt.observe('mrc/position').subscribe((message: any) => {
        const data = JSON.parse(message.payload.toString());
        this.canRotate = true;
        this.currentRoom = this.rooms.find(room => room.uuid === data.uuid) || null;
      });
    }
  }

  rotateTable(room: Room) {
    this.canRotate = false;
    this.coreService.getDistanceBetweenRooms(this.currentRoom!, room).subscribe((resp: any) => {
      let dist = resp.distance;

      this.mqtt!.unsafePublish(`mrc/rotate`, JSON.stringify({
          uuid: resp.uuid,
          slug: resp.slug,
          distance: dist,
          reverse: dist < 0,
      }), { qos: 1, retain: false });
    });
  }

  switchMotor() {
    this.mqtt!.unsafePublish(`mrc/debug`, JSON.stringify({
      action: 'motor', value: this.motorValue ? 'on' : 'off'
    }), { qos: 1, retain: false });
  }

  switchBrake($event: any) {
    this.mqtt!.unsafePublish(`mrc/debug`, JSON.stringify({
      action: 'brake',
      value: $event.value.value,
      direction: $event.value.direction,
    }), { qos: 1, retain: false });
  }


  switchRoomLight(room: Room) {
    this.mqtt!.unsafePublish(`mrc/debug`, JSON.stringify({
      action: 'room_light',
      pin: room.lightPin,
    }
    ), { qos: 1, retain: false });
  }

  switchItemLight(item: Item) {
    this.mqtt!.unsafePublish(`mrc/debug`, JSON.stringify({
      action: 'item_light',
      lightCtrl: item.lightCtrl,
      lightPin: item.lightPin,
    }
    ), { qos: 1, retain: false });
  }

  print() {
    this.mqtt!.unsafePublish(`mrc/print`, JSON.stringify([
      { name: 'test', url: 'https://test.com' },
      { name: 'test2', url: 'https://test.com' },
    ])
  , { qos: 1, retain: false });
  }

  resetPosition() {
    const garden = this.rooms.find(room => room.slug === 'jardin');

    this.mqtt!.unsafePublish(`mrc/rotate`, JSON.stringify({
      uuid: garden!.uuid,
      slug: garden!.slug,
      distance: 0,
      reverse: false,
    }), { qos: 1, retain: false });
  }

  resetClient() {
    this.mqtt!.unsafePublish(`mrc/debug`, JSON.stringify({
      action: 'reset_client',
    }), { qos: 1, retain: false });
  }

  closeDialog() {
    this.showItemLightDialog = false;
    this.currentEditingItem = null;
    this.itemLightForm.reset();
  }

  editItemConfig(item: Item) {
    this.currentEditingItem = item;
    this.showItemLightDialog = true;
    this.itemLightForm.patchValue({
      lightCtrl: item.lightCtrl,
      lightPin: item.lightPin
    })
  }

  saveLightItemConfig() {
    if(this.currentEditingItem && this.itemLightForm.valid) {
      this.coreService.updateItem(this.currentEditingItem.uuid, this.itemLightForm.value).subscribe((updatedItem: Item) => {
        this.closeDialog();
      });
    }
  }
}
