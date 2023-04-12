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
  }

  ngOnInit(): void {
    const service = this.config.data.service;
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.coreService.getAreas().subscribe((areas: Area[]) => this.areas = areas);

    this.serviceForm = this.fb.group({
      title: [service ? service.title : '' , [Validators.required]],
      description: [service ? service.description : '', [Validators.required]],
      areaId: [service ? service.areaId : null, [Validators.required]],
      url: [service ? service.url : '', [Validators.required, Validators.pattern(urlRegex)]],
      useId: [service ? service.useId : null, [Validators.required]],
    });

  }

  save() {
    this.ref.close(this.serviceForm.value);
  }

}
