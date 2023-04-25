import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

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
    this.authService.user$.subscribe((x) => (this.user = x));

  }


  signout(){
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }




}
