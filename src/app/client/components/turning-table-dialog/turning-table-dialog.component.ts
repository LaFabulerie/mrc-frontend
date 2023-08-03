import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { RemoteControlService } from 'src/app/services/control.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-turning-table-dialog',
  templateUrl: './turning-table-dialog.component.html',
  styleUrls: ['./turning-table-dialog.component.scss']
})
export class TurningTableDialogComponent implements OnInit {

  constructor(
    private config: DynamicDialogConfig,
    private control: RemoteControlService,
  ) { }

  ngOnInit(): void {
    const next = this.config.data.next;
    console.log(next);
    setTimeout(() => {
      this.control.closeDialog(TurningTableDialogComponent);//, next);
    }, 3000);
  }

}
