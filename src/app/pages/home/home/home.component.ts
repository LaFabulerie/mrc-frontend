import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  user?: User;

  data : TreeNode[]

  constructor(
    private authService: AuthService,
  ) {
    this.user = this.authService.userValue;
    this.data = [
      {
        label: 'Chambre',
        data: 'Chambre',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        type: 'room',
        children: [
          {

          }
        ]
      },
      {
        label: 'Cuisine',
        data: 'Cuisine',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        type: 'room',
        children: [
        ]
      },
      {
        label: 'Salon',
        data: 'Salon',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        type: 'room',
        children: [
        ]
      },
      {
        label: 'Salle de bain',
        data: 'Salle de bain',
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        type: 'room',
        children: [

        ]
      },
    ];

  }

  ngOnInit(): void {
    console.log(this.authService.userValue)
  }

  signout(){
    this.authService.logout();
  }
}
