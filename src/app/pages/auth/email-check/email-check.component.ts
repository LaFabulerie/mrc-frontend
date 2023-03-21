import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-email-check',
  templateUrl: './email-check.component.html',
})
export class EmailCheckComponent {

  checking: boolean;
  emailValid: boolean;
  resent: boolean;
  manualCheck: boolean;
  redirectTimer: number;
  email: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {
    this.checking = true;
    this.emailValid = false;
    this.resent = false;
    this.manualCheck = false;
    this.email = '';
    this.redirectTimer = 5;
  }

  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('key');
    if (key) {
      if(key == 'manual') {
        this.checking = false;
        this.manualCheck = true;
      } else {
        this.authService.verifyEmail(key).subscribe({
          next: _ => {
            this.checking = false;
            this.emailValid = true;
            const timer = setInterval(() => {
              this.redirectTimer--;
              if (this.redirectTimer === 0) {
                clearInterval(timer);
                this.router.navigate(['/signin']);
              }
            }, 1000);
          },
          error: _ => {
            this.checking = false;
            this.emailValid = false;
          },
        });
      }
    }
  }

  resend() {
    this.authService.resendVerificationEmail(this.email).subscribe(_ => this.resent = true);
  }
}
