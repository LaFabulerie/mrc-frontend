import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDigitalUseComponent } from './edit-digital-use/edit-digital-use.component';
import { ChipModule } from 'primeng/chip';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EditDigitalUseComponent
  ],
  imports: [
    CommonModule,
    ChipModule,
    ConfirmPopupModule,
    InplaceModule,
    InputTextModule,
    FormsModule,
  ],
  exports: [
    EditDigitalUseComponent
  ],
  providers: [
    ConfirmationService
  ]
})
export class ComponentsModule { }
