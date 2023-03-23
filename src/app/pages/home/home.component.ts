import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { CoreService } from 'src/app/services/core.service';
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
  ) {
    this.user = this.authService.userValue;

  }


  signout(){
    this.authService.logout();
  }




}
