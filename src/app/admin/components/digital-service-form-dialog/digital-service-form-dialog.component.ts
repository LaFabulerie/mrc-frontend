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

  constructor(
    public ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
  ) {
    const service = this.config.data.service;

    this.serviceForm = this.fb.group({
      title: [service ? service.title : '' , [Validators.required]],
      description: [service ? service.description : '', [Validators.required]],
      url: [service ? service.url : '', [Validators.required]],
      scope: [service ? service.scope : '', [Validators.required]],
      useId: [service ? service.useId : this.config.data.useId, [Validators.required]],
      contact: [service ? service.contact : ''],
    });
  }

  ngOnInit(): void {

  }

  save() {
    this.ref.close(this.serviceForm.value);
  }

}
