import { Component } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';
import {  DynamicDialogConfig } from 'primeng/dynamicdialog';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent {

  videoUrl?: string;
  width = 960;
  height = 540;
  api?: VgApiService;

  constructor(
    private config: DynamicDialogConfig,
    private control: RemoteControlService,
  ) {
    this.videoUrl = this.config.data.videoURL;
  }

  onPlayerReady(api:VgApiService) {
    this.api = api;
    this.api.play();
    this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
      this.control.closeDialog();
    });

  }

  skip() {
    this.control.closeDialog();
  }

}
