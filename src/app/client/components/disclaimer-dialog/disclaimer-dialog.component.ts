import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-disclaimer-dialog',
  templateUrl: './disclaimer-dialog.component.html',
  styleUrls: ['./disclaimer-dialog.component.scss']
})
export class DisclaimerDialogComponent implements OnInit {

  constructor(
    private config: DynamicDialogConfig,
    private control: RemoteControlService,
  ) { }

  ngOnInit(): void {
    const next = this.config.data.next;
    setTimeout(() => {
      this.control.closeDialog(DisclaimerDialogComponent, next);
    }, 3000);
  }

}
