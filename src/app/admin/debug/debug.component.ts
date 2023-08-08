import { Component, OnInit } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { SelectButtonOptionClickEvent } from 'primeng/selectbutton';
import { Item, Room } from 'src/app/models/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit{

  rooms: Room[] = []
  lightValues: {[Key: string]: boolean} = {}
  motorValue = true
  brakeValue = false
  canRotate = true
  position = '0'
  currentRoom = 'entrée : 0'

  brakeOptions = [
    { label: 'Backward', value: "on", direction: -1 },
    { label: 'OFF', value: "off", direction: 0 },
    { label: 'Forward', value: "on", direction: 1 },
  ];

  constructor(
    private mqtt: MqttService,
    private coreService: CoreService,
  ) { }

  ngOnInit(): void {
    this.coreService.getRooms({
      expand: ['items'],
    }).subscribe(rooms => {
      this.rooms = rooms
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
      console.log(data)
      this.canRotate = true;
      this.currentRoom = `${data.room} : ${data.current}`
    });
  }

  rotateTable(room: Room) {
    this.canRotate = false;
    this.mqtt.unsafePublish(`mrc/room`, JSON.stringify({
        uuid: room.uuid,
        slug: room.slug,
        position: room.position,
    }), { qos: 1, retain: false });
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
    console.log(room)
    this.mqtt.unsafePublish(`mrc/nav`, JSON.stringify({
      url: ['room', room.slug, room.uuid],
      state : {
        lightPin: room.lightPin,
      }
    }
    ), { qos: 1, retain: false });
  }

  switchItemLight(item: Item) {
    this.mqtt.unsafePublish(`mrc/nav`, JSON.stringify({
      url: ['item', item.uuid],
      state : {
        lightCtrl: item.lightCtrl,
        lightPin: item.lightPin,
      }
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

}
