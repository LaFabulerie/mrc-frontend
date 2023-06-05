import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-door',
  templateUrl: './home.component.html',
})
export class HomeComponent{

  user?: User;

  data : TreeNode[] = []

  currentUse: any;

  constructor(
    private authService: AuthService,
    private coreService: CoreService,
    private router: Router,
  ) {
    this.authService.user$.subscribe((x) => (this.user = x));
    this.coreService.loadDigitalUses();

  }


  signout(){
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }




}
