import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
})
export class ResetPwdComponent implements OnInit {

  resetPwdForm: FormGroup;
  errors: any;

  success: boolean = false;
  redirectTimer: number = 5;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,

  ) {
    this.errors = {};
    const uid = this.route.snapshot.paramMap.get('uid');
    const token = this.route.snapshot.paramMap.get('token');

    this.resetPwdForm = this.fb.group({
      uid: [uid],
      token: [token],
      newPassword1: ['', Validators.required],
      newPassword2: ['', Validators.required],
    });
  }

  ngOnInit(): void {

  }

  resetPwd(){
    this.authService.resetPwdConfirm(this.resetPwdForm.value).subscribe({
      next: () => {
        this.success = true;
        const timer = setInterval(() => {
          this.redirectTimer--;
          if (this.redirectTimer === 0) {
            clearInterval(timer);
            this.router.navigate(['/auth/signin']);
          }
        }, 1000);
      },
      error: errorResp => {
        for(let key in errorResp.error){
          this.errors[key] = errorResp.error[key];
        }
      }
    });
  }

}
