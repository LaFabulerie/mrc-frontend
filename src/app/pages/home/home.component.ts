import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent{

  user?: User;

  data : TreeNode[] = []

  currentUse: any;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = this.authService.userValue;

  }


  signout(){
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }




}
