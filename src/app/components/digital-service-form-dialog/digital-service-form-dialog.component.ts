import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Area } from 'src/app/models/use';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-digital-service-form-dialog',
  templateUrl: './digital-service-form-dialog.component.html',
  styleUrls: ['./digital-service-form-dialog.component.scss']
})
export class DigitalServiceFormDialogComponent implements OnInit {

  serviceForm!: FormGroup;

  areas: Area[] = []

  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private coreService: CoreService,
  ) {
    const service = this.config.data.service;
    let useId = 0;
    let areaId = 0;
    if(service) {
      useId = service.useId;
      areaId = service.areaId;
    } else {
      useId = this.config.data.useId;
      areaId = this.config.data.areaId;
    }

    this.coreService.getAreas().subscribe((areas: Area[]) => this.areas = areas);

    this.serviceForm = this.fb.group({
      title: [service ? service.title : '' , [Validators.required]],
      description: [service ? service.description : '', [Validators.required]],
      url: [service ? service.url : '', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      areaId: [areaId, [Validators.required]],
      useId: [useId, [Validators.required]],
    });
  }

  ngOnInit(): void {

  }

  save() {
    this.ref.close(this.serviceForm.value);
  }

}
