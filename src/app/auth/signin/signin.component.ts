import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
})
export class SigninComponent implements OnInit{

  signinForm: any;
  errors: any;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    if(this.authService.currentUser){
      this.router.navigate(['/admin']);
    }
  }

  ngOnInit(): void {
    this.errors = {};

    this.signinForm = this.fb.group({
      username: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
    });

    this.signinForm.get("email").valueChanges.subscribe((v: String) => {
      this.signinForm.get("username").setValue(v);
   })
  }

  signin(){
    this.authService.signin(this.signinForm.value).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
        console.log("return URL ---->" + returnUrl);
        this.router.navigate([returnUrl]);
      },
      error: (errorResp) => {
        for(let key in errorResp.error){
          this.errors[key] = errorResp.error[key];
        }
      }
    });
  }

}
