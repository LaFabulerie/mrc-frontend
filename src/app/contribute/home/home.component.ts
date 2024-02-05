import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ContributeService } from 'src/app/services/contribute.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{

  signinForm: any;
  errors: any;


  constructor(
    private fb: FormBuilder,
    private contributeService: ContributeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
  }

  signin(){
  }

}
