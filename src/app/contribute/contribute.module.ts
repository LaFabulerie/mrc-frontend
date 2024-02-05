import { NgModule } from '@angular/core';

import { ContributeRoutingModule } from './contribute-routing.module';
import { HomeComponent } from './home/home.component';

import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    HomeComponent,
  ],
    imports: [
        ContributeRoutingModule,
    ],
  providers: [
    MessageService
  ],
})
export class ContributeModule { }
