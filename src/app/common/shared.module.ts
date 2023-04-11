import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { SafeHtmlPipe } from './safe-html.pipe';

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
    ButtonModule,
    InputTextModule,
    ToastModule,
    SafeHtmlPipe,
  ]
})
export class SharedModule { }
