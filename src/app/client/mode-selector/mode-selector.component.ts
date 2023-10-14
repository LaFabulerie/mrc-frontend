import {Component, inject, OnInit} from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { RemoteControlService } from 'src/app/services/control.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-mode-selector',
  templateUrl: './mode-selector.component.html',
  styleUrls: ['./mode-selector.component.scss']
})
export class ModeSelectorComponent implements OnInit {

  private readonly mqtt : MqttService | undefined

  constructor(
    private control: RemoteControlService,
  ) {
    if(environment.mqttBrokerHost && !environment.houseless){
      this.mqtt = inject(MqttService);
      this.controlSetup();
    } else {
      this.control.navigate(['door']);
    }

  }

  private controlSetup() {
    this.control.navBarEnabled = false;
    this.control.showMapButton = false;
    this.control.showBackButton = false;
    this.control.showListButton = true;
    this.control.showExitButton = true;
    this.control.bgColor = '#000000';
  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());
  }

  start(mode: string) {
    if(this.mqtt){
      this.mqtt.unsafePublish('mrc/mode', JSON.stringify({
        mode: mode,
        uniqueId: this.control.uniqueId,
        type: 'REQ'
      }), { qos: 1, retain: false });
    }
  }
}
