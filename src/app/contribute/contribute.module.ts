import { NgModule } from '@angular/core';

import { ContributeRoutingModule } from './contribute-routing.module';
import { HomeComponent } from './home/home.component';

import { MessageService } from 'primeng/api';
import { SharedModule } from '../common/shared.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
    imports: [
        ContributeRoutingModule,
        SharedModule,
    ],
  providers: [
    MessageService
  ],
})
export class ContributeModule { }
