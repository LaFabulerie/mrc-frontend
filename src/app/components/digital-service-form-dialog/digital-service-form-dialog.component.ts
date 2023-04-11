import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-digital-service-form-dialog',
  templateUrl: './digital-service-form-dialog.component.html',
  styleUrls: ['./digital-service-form-dialog.component.scss']
})
export class DigitalServiceFormDialogComponent implements OnInit {

  serviceForm!: FormGroup;

  zones = [
    {label: 'National', value: 'National'},
    {label: 'Local', value: 'Local'},
  ];

  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    const service = this.config.data.service;
    console.log(service)
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.serviceForm = this.fb.group({
      title: [service ? service.title : '' , [Validators.required]],
      description: [service ? service.description : '', [Validators.required]],
      zone: [service ? service.zone : '', [Validators.required]],
      url: [service ? service.url : '', [Validators.required, Validators.pattern(urlRegex)]],
    });

  }

  save() {
    this.ref.close(this.serviceForm.value);
  }

}
