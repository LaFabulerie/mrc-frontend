import { Component, OnInit } from '@angular/core';
import { BasketService } from 'src/app/services/basket.service';
import { RemoteControlService } from 'src/app/services/control.service';
import { environment } from 'src/environments/environment';
import { DigitalService } from 'src/app/models/core';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { timeout } from 'rxjs';

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

  selectedServiceStates: { [id: string] : boolean; } = {};

  emailLoading: boolean = false;
  printLoading: boolean = false;
  downloadLoading: boolean = false;

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
      services.forEach((service: DigitalService) => this.selectedServiceStates[service.uuid] = true);
      this.basketEmpty = services.length == 0;
    })
  }

  isSelected(service: DigitalService) {
    return this.selectedServiceStates[service.uuid];
  }

  get selectedServices(): DigitalService[] {
    return this.basket.services.filter(s => this.selectedServiceStates[s.uuid]);
  }

  get selectedServiceUUIDs(): string[] {
    return this.selectedServices.map(s => s.uuid);
  }

  get selectedServicesCount(): number {
    return this.selectedServices.length;
  }

  print() {
    if(this.printLoading) return;
    this.printLoading = true;
    this.basket.print(this.selectedServiceUUIDs);
    this.printLoading = false;
  }

  download() {
    if(this.downloadLoading) return;
    this.downloadLoading = true;
    this.basket.downloadPDF(this.selectedServiceUUIDs).subscribe(blob => {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = 'services.pdf';
      downloadLink.click();
      this.downloadLoading = false;
    });
  }

  sendMail() {
    if(this.emailLoading) return;
    this.emailLoading = true;
    this.basket.sendByEmail(this.email, this.selectedServiceUUIDs).subscribe(_ => {
      this.showEmailDialog = false;
      this.email = "";
      this.emailLoading = false;
    });
  }

  // selectionChanged($event: CheckboxChangeEvent, service: DigitalService) {
  //   if ($event.checked) {
  //     this.selectedServices.push(service);
  //   } else {
  //     this.selectedServices = this.selectedServices.filter(s => s.uuid != service.uuid);
  //   }
  // }

  goToBack() {
    document.getElementById("backBtn")?.click();
  }

}
