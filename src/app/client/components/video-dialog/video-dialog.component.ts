import { Component } from '@angular/core';
import { VgApiService } from '@videogular/ngx-videogular/core';
import {  DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent {

  videoUrl?: string;
  width = 960;
  height = 540;

  constructor(
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
  ) {
    this.videoUrl = this.config.data.videoURL;
  }

  onPlayerReady(api:VgApiService) {
    api.getDefaultMedia().subscriptions.ended.subscribe(() => {
      this.ref.close();
    });

  }

}
