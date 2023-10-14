import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../common/shared.module';
import { CatalogComponent } from './catalog/catalog.component';
import { HomeComponent } from './home/home.component';
import { DebugComponent } from './debug/debug.component';
import {EditDigitalUseComponent} from "./components/edit-digital-use/edit-digital-use.component";
import {NewDigitalUseComponent} from "./components/new-digital-use/new-digital-use.component";
import {TagPickerDialogComponent} from "./components/tag-picker-dialog/tag-picker-dialog.component";
import {DigitalServiceFormDialogComponent} from "./components/digital-service-form-dialog/digital-service-form-dialog.component";
import { MenubarModule } from 'primeng/menubar';
import { ImportExportDialogComponent } from './components/import-export-dialog/import-export-dialog.component';
import { TreeSelectModule } from 'primeng/treeselect';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [
    HomeComponent,
    CatalogComponent,
    DebugComponent,
    EditDigitalUseComponent,
    NewDigitalUseComponent,
    TagPickerDialogComponent,
    DigitalServiceFormDialogComponent,
    ImportExportDialogComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    MenubarModule,
    TreeSelectModule,
    FileUploadModule,
  ]
})
export class AdminModule { }
