import { Component, OnInit } from '@angular/core';
import { BasketService } from 'src/app/services/basket.service';
import { RemoteControlService } from 'src/app/services/control.service';
import { environment } from 'src/environments/environment';
import { DigitalService } from 'src/app/models/core';
import { CheckboxChangeEvent } from 'primeng/checkbox';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit{
  basketEmpty: boolean = true;
  mode: string = "web";
  showEmailDialog: boolean = false;
  email: string = "";

  selectedServices: DigitalService[] = [];

  constructor(
    public basket: BasketService,
    private control: RemoteControlService,
  ) { }

  private controlSetup() {
    this.control.navBarEnabled = true;
    this.control.showMapButton = true;
    this.control.showBackButton = true;
    this.control.showListButton = true;
    this.control.showExitButton = true;
    this.control.bgColor = '#FFFFFF';
    this.mode = environment.executionMode;
  }

  ngOnInit(): void {
    this.control.navigationMode$.subscribe(v => this.controlSetup());

    this.basket.basketSubject$.subscribe(services => {
      this.basketEmpty = services.length == 0;
    })
  }

  print() {
    const selectedServiceIds = this.selectedServices.map(s => s.id);
    this.basket.print(selectedServiceIds);
  }

  download() {
    const selectedServiceIds = this.selectedServices.map(s => s.id);
    this.basket.downloadPDF(selectedServiceIds).subscribe(blob => {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'services.pdf';
      downloadLink.click();
    });
  }

  isSelected(service: DigitalService) {
    return this.selectedServices.findIndex(s => s.id == service.id) != -1;
  }

  sendMail() {
    const selectedServiceIds = this.selectedServices.map(s => s.id);
    this.basket.sendByEmail(this.email, selectedServiceIds).subscribe(_ => {
      this.showEmailDialog = false;
      this.email = "";
    });
  }

  selectionChanged($event: CheckboxChangeEvent, service: DigitalService) {
    if ($event.checked) {
      this.selectedServices.push(service);
    } else {
      this.selectedServices = this.selectedServices.filter(s => s.id != service.id);
    }
  }

  goToBack() {
    document.getElementById("backBtn")?.click();
  }

}
