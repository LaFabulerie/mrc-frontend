import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { BasketService } from 'src/app/services/basket.service';

@Component({
  selector: 'app-exit-dialog',
  templateUrl: './exit-dialog.component.html',
  styleUrls: ['./exit-dialog.component.scss']
})
export class ExitDialogComponent {


  constructor(
    private ref : DynamicDialogRef,
    public basket: BasketService,

  ) { }

  exit(response: boolean) {
      this.ref.close(response);
  }

  goToBasket() {
    this.ref.close(['basket']);
  }


}
