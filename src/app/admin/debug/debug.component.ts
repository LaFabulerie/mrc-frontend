import { Component, OnInit } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { Item, Room } from 'src/app/models/core';
import { CoreService } from 'src/app/services/core.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
  position = '0'
  currentRoom: Room|null = null

  brakeOptions = [
    { label: 'Backward', value: "on", direction: -1 },
    { label: 'OFF', value: "off", direction: 0 },
    { label: 'Forward', value: "on", direction: 1 },
  ];

  showItemLightDialog = false;
  showRoomPositionDialog = false;

  itemLightForm: FormGroup
  roomPositionForm: FormGroup
  currentEditingItem: Item|null = null;

  constructor(
    private mqtt: MqttService,
    private coreService: CoreService,
    private fb: FormBuilder,
  ) {
    this.itemLightForm = this.fb.group({
      lightCtrl: ['', [Validators.required]],
      lightPin: ['', [Validators.required]]
    });

    this.roomPositionForm = this.fb.group({
      position: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.coreService.rooms$.subscribe((rooms: Room[]) => {
      this.rooms = rooms;
      this.currentRoom = this.rooms.find(room => room.position ==0) || null;
      this.rooms.forEach(room => {
        this.lightValues[room.uuid] = false
        room.items.forEach(item => this.lightValues[item.uuid] = false)
      });
    });

    this.mqtt.observe('mrc/debug').subscribe((message: any) => {
      const data = JSON.parse(message.payload.toString());
      if(data.hasOwnProperty('position')) {
        this.position = data.position.toString()
      }
    });

    this.mqtt.observe('mrc/position').subscribe((message: any) => {
      const data = JSON.parse(message.payload.toString());
      this.canRotate = true;
      this.currentRoom = this.rooms.find(room => room.slug === data.slug) || null;
    });
  }

  rotateTable(room: Room) {
    this.canRotate = false;
    this.coreService.getDistanceBetweenRooms(this.currentRoom!, room).subscribe((resp: any) => {
      this.mqtt.unsafePublish(`mrc/rotate`, JSON.stringify({
          uuid: resp.uuid,
          slug: resp.slug,
          distance: resp.distance,
      }), { qos: 1, retain: false });
    });
  }

  switchMotor() {
    this.mqtt.unsafePublish(`mrc/debug`, JSON.stringify({
      action: 'motor', value: this.motorValue ? 'on' : 'off'
    }), { qos: 1, retain: false });
  }

  switchBrake($event: any) {
    this.mqtt.unsafePublish(`mrc/debug`, JSON.stringify({
      action: 'brake',
      value: $event.value.value,
      direction: $event.value.direction,
    }), { qos: 1, retain: false });
  }


  switchRoomLight(room: Room) {
    this.mqtt.unsafePublish(`mrc/debug`, JSON.stringify({
      action: 'room_light',
      pin: room.lightPin,
    }
    ), { qos: 1, retain: false });
  }

  switchItemLight(item: Item) {
    this.mqtt.unsafePublish(`mrc/debug`, JSON.stringify({
      action: 'item_light',
      lightCtrl: item.lightCtrl,
      lightPin: item.lightPin,
    }
    ), { qos: 1, retain: false });
  }

  print() {
    this.mqtt.unsafePublish(`mrc/print`, JSON.stringify([
      { name: 'test', url: 'https://test.com' },
      { name: 'test2', url: 'https://test.com' },
    ])
  , { qos: 1, retain: false });
  }

  resetPosition() {
    this.mqtt.unsafePublish(`mrc/debug`, JSON.stringify({
      action: 'reset_position',
    }), { qos: 1, retain: false });
  }

  resetClient() {
    this.mqtt.unsafePublish(`mrc/debug`, JSON.stringify({
      action: 'reset_client',
    }), { qos: 1, retain: false });
  }

  closeDialog() {
    this.showItemLightDialog = false;
    this.showRoomPositionDialog = false;
    this.currentEditingItem = null;
    this.itemLightForm.reset();
    this.roomPositionForm.reset();
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

  editRoomConfig(room: Room) {
    this.showRoomPositionDialog = true;
    this.roomPositionForm.patchValue({
      position: room.position
    });
  }

  saveRoomPosition(roomUuid: string) {
    if(this.roomPositionForm.valid) {
      this.coreService.updateRoom(roomUuid, this.roomPositionForm.value).subscribe((updatedRoom) => {
        this.closeDialog();
      })
    }
  }
}
