import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './safe-html.pipe';

import { TreeModule } from 'primeng/tree';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import {StyleClassModule} from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { ChipModule } from 'primeng/chip';
import { InplaceModule } from 'primeng/inplace';
import { EditorModule } from 'primeng/editor';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import {RippleModule} from "primeng/ripple";
import { RadioButtonModule } from 'primeng/radiobutton';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { SelectButtonModule } from 'primeng/selectbutton';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering'

@NgModule({
  imports:      [
  ],
  declarations: [
    SafeHtmlPipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    StyleClassModule,
    TreeModule,
    AutoCompleteModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    InputTextModule,
    TableModule,
    BadgeModule,
    ConfirmPopupModule,
    ChipModule,
    InplaceModule,
    EditorModule,
    DynamicDialogModule,
    ScrollPanelModule,
    SafeHtmlPipe,
    SelectButtonModule,
    CheckboxModule,
    RadioButtonModule,
    InputSwitchModule,
    RippleModule,

    FontAwesomeModule,

    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  providers: [
    ConfirmationService,
    DialogService,
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
