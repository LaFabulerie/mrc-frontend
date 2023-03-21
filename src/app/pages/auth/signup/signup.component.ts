import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {

  signupForm: any;
  errors: any;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.errors = {};

    this.signupForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, Validators.required],
      password1: [null, Validators.required],
      password2: [null, Validators.required],
    });

    this.signupForm.get("email").valueChanges.subscribe((v: String) => {
      this.signupForm.get("username").setValue(v);
   })
  }

  save(){
    this.authService.signup(this.signupForm.value).subscribe({
      next: (resp: any) => {
        this.messageService.add({
          key: 'messageToast',
          summary:'Information',
          detail: resp.detail
        });
        this.signupForm.reset();
      },
      error: (errorResp) => {
        for(let key in errorResp.error){
          this.errors[key] = errorResp.error[key];
        }
      }
    });
  }

}
