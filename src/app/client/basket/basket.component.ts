import { Component, OnInit } from '@angular/core';
import { BasketService } from 'src/app/services/basket.service';
import { RemoteControlService } from 'src/app/services/control.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit{
  basketEmpty: boolean = true;
  mode: string = "web";

  constructor(
    public basket: BasketService,
    private control: RemoteControlService,
  ) { }

  private controlSetup() {
    this.control.showMapButton = true;
    this.control.showBackButton = true;
    this.control.showListButton = true;
    this.control.showExitButton = true;
    this.control.bgColor = '#FFFFFF';
    this.mode = environment.mode;
  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());

    this.basket.basketSubject$.subscribe(services => {
      this.basketEmpty = services.length == 0;
    })
  }

  print() {
    this.basket.print();
  }
}
