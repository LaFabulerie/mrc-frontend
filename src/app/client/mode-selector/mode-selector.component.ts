import { Component, OnInit } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-mode-selector',
  templateUrl: './mode-selector.component.html',
  styleUrls: ['./mode-selector.component.scss']
})
export class ModeSelectorComponent implements OnInit {

  constructor(
    private control: RemoteControlService,
    private mqtt: MqttService,
  ) {
    this.controlSetup();
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
    this.mqtt.unsafePublish('mrc/mode', JSON.stringify({
      mode: mode,
      uniqueId: this.control.uniqueId,
      type: 'REQ'
    }), { qos: 1, retain: false });
    // this.control.navigationMode = mode;
    // this.control.navigate(['door']);
  }
}
