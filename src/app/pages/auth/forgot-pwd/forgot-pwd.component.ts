import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
})
export class ForgotPwdComponent implements OnInit {

  email: string;
  emailSent: boolean = false;

  constructor(
    private authService: AuthService,
  ) {
    this.email = '';
  }

  ngOnInit(): void {
  }

  resetPwd() {
    this.authService.resetPwd(this.email).subscribe(_ => {
      this.emailSent = true;
    });
  }

}
