import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, TreeNode } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CoreService } from 'src/app/services/core.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-door',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{

  user?: User;

  data : TreeNode[] = []

  currentUse: any;

  menuItems: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    private coreService: CoreService,
    private router: Router,
    private feedbackService: FeedbackService,
  ) {
    this.authService.user$.subscribe((x) => (this.user = x));
    this.coreService.loadDigitalUses();
    this.coreService.loadRooms();
    this.coreService.loadItems();
    this.feedbackService.loadQuestions();
  }

  ngOnInit(): void {
    this.menuItems = [
      {
        label: 'Catalogues',
        icon: 'pi pi-fw pi-list',
        routerLink: ['/admin/catalog'],
      },
      {
        label: 'Retours d\'expérience',
        icon: 'pi pi-fw pi-book',
        items: [
          {
            label: 'Questions',
            icon: 'pi pi-fw pi-question',
            routerLink: ['/admin/feedback/questions'],
          },
          {
            label: 'Retours usagers',
            icon: 'pi pi-fw pi-thumbs-up',
            routerLink: ['/admin/feedback/answers'],
          },
        ],
      },
    ];

    if(environment.mqttBrokerHost && !environment.houseless){
      this.menuItems.push({
        label: 'Debug',
        icon: 'pi pi-fw pi-sliders-h',
        routerLink: ['/admin/debug'],
      });
    }
  }

  signout(){
    this.authService.logout();
    this.router.navigate(['/auth/signin']);
  }




}
