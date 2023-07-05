import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-disclaimer-dialog',
  templateUrl: './disclaimer-dialog.component.html',
  styleUrls: ['./disclaimer-dialog.component.scss']
})
export class DisclaimerDialogComponent implements OnInit {

  constructor(
    private config: DynamicDialogConfig,
    private ref : DynamicDialogRef,
  ) { }

  ngOnInit(): void {
    const next = this.config.data.next;
    setTimeout(() => {
      this.ref.close(next);
    }, 3000);
  }

}
