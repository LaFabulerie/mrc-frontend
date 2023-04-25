import { NgModule } from '@angular/core';
import { EditDigitalUseComponent } from './edit-digital-use/edit-digital-use.component';
import { TagPickerDialogComponent } from './tag-picker-dialog/tag-picker-dialog.component';
import { WelcomeImageComponent } from './welcome-image/welcome-image.component';
import { DigitalServiceFormDialogComponent } from './digital-service-form-dialog/digital-service-form-dialog.component';
import { SharedModule } from '../common/shared.module';
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
  ],
  exports: [
    EditDigitalUseComponent,
    WelcomeImageComponent,
    NewDigitalUseComponent,
  ],

})
export class ComponentsModule { }
