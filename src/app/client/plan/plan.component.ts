import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/use';
import { CoreService } from 'src/app/services/core.service';
import { MqttService } from 'src/app/services/mqtt.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
})
export class PlanComponent  implements OnInit{

  rooms: Room[] = [];
  constructor(
    private coreService: CoreService,
    private router: Router,
    private mqtt: MqttService,
  ) { }

  ngOnInit(): void {
    this.coreService.getRooms({
      expand: ['items','items.room', 'items.uses', 'items.uses.services', 'items.uses.services.area'],
      omit: ['items.room.items', 'items.uses.items' ]
    }).subscribe((rooms: Room[]) => {
      this.rooms = rooms;
    });
  }

  goToRoom(room: Room) {
    this.mqtt.publish({
      verb: 'activate',
      type: 'room',
      identifier: room.uuid
    }).subscribe(_ => {
      this.router.navigateByUrl('/room', { state: room });
    })
  }

}
