import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DigitalService } from 'src/app/models/use';
import { BasketService } from 'src/app/services/basket.service';
import { RemoteControlService } from 'src/app/services/control.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit{
  basketEmpty: boolean = true;

  constructor(
    public basket: BasketService,
    private control: RemoteControlService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.control.showControls = true;
    this.control.showLogo = false;
    this.control.title = "Liste des services selectionnés";

    let state = this.location.getState() as any;
    this.control.currentBackUrl = state['back']

    this.basket.basketSubject$.subscribe(services => {
      this.basketEmpty = services.length == 0;
    })
  }
}
