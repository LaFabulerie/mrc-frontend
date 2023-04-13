import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditDigitalUseComponent } from './edit-digital-use/edit-digital-use.component';
import { ChipModule } from 'primeng/chip';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { InplaceModule } from 'primeng/inplace';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TagPickerDialogComponent } from './tag-picker-dialog/tag-picker-dialog.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { WelcomeImageComponent } from './welcome-image/welcome-image.component';
import { DigitalServiceFormDialogComponent } from './digital-service-form-dialog/digital-service-form-dialog.component';
import { SharedModule } from '../common/shared.module';
import { SafeHtmlPipe } from '../common/safe-html.pipe';
import { NewDigitalUseComponent } from './new-digital-use/new-digital-use.component';
@NgModule({
  declarations: [
    EditDigitalUseComponent,
    TagPickerDialogComponent,
    WelcomeImageComponent,
    DigitalServiceFormDialogComponent,
    NewDigitalUseComponent,
  ],
  imports: [
    SharedModule,
    ChipModule,
    ConfirmPopupModule,
    InplaceModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    EditorModule,
    DynamicDialogModule,
    AutoCompleteModule,
    ScrollPanelModule,
    ReactiveFormsModule,
  ],
  exports: [
    EditDigitalUseComponent,
    WelcomeImageComponent,
    NewDigitalUseComponent,
  ],
  providers: [
    ConfirmationService,
    DialogService,
  ]
})
export class ComponentsModule { }
