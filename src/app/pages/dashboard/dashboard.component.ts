import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit{

  data : any[] = []
  currentUse: any;

  constructor(
    private coreService: CoreService
  ) {
  }

  ngOnInit(): void {
    this.coreService.getRooms().subscribe((rooms: any) => {
      rooms.forEach((room: any) => {
        this.data.push({
          label: room.name,
          data: room.id,
          type: 'room',
          expandedIcon: 'pi pi-folder-open',
          collapsedIcon: 'pi pi-folder',
          children: room.items.map((item: any) => {
            return {
              label: item.name,
              data: item.id,
              type: 'item',
              expandedIcon: 'pi pi-folder-open',
              collapsedIcon: 'pi pi-folder',
              children: item.uses.map((use: any) => {
                return {
                  label: use.title,
                  data: use.id,
                  type: 'use',
                  leaf: true
                  // children: use.services.map((service: any) => {
                  //   return {
                  //     label: service.title,
                  //     data: service.id,
                  //     type: 'service',

                  //   }
                  // })
                }
              })
            }
          })
        })
      })
    });
  }

  showUse(use: any){
    console.log(use)
    this.currentUse = use;
  }
}
