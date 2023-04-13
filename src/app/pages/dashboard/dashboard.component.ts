import { Component, OnInit } from '@angular/core';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { DigitalUse, Item } from 'src/app/models/use';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  data: TreeNode[] = [];
  selectedNode!: TreeNode | null;
  suggestions: any[] = [];

  firstLoad: boolean = true;
  saving: boolean = false;
  saved: boolean = false;

  digitalUseCreation: boolean = false;
  newCreatedUse: DigitalUse | null = null;
  updatedUse: DigitalUse | null = null;

  constructor(
    private coreService: CoreService,
    private confirmationService: ConfirmationService,
  ) {
  }

  ngOnInit(): void {
    this.coreService.digitalUses$.subscribe((uses: DigitalUse[]) => {
      this.data = [];
      uses.forEach((use: DigitalUse) => {
        const newUse = {
          label: use.title,
          data: use.id,
          type: 'use',
          icon: 'pi pi-file',
          leaf: true
        }
        use.items.forEach((item: Item) => {
          let room = this.data.find((node: TreeNode) => node.type === 'room' && node.data === item.room.id)
          if(!room) {
            this.data.push({
              label: item.room.name,
              data: item.room.id,
              type: 'room',
              expandedIcon: 'pi pi-folder-open',
              collapsedIcon: 'pi pi-folder',
              children: [{
                label: item.name,
                data: item.id,
                type: 'item',
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
                children: [newUse]
              }]
            });
          } else {
            let _item = room.children!.find((node: TreeNode) => node.type === 'item' && node.data === item.id);
            if(!_item) {
              room.children!.push({
                label: item.name,
                data: item.id,
                type: 'item',
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
                children: [newUse]
              });
            } else {
              _item.children!.push(newUse);
            }
          }
        });
      });
      console.log("Building tree", this.firstLoad, this.newCreatedUse, this.updatedUse)
      if(this.firstLoad && this.data.length > 0){
        this._selectFirstUseNode(this.data);
        this.firstLoad = false;
      } else if(this.newCreatedUse) {
        this._selectNodeById(this.data, this.newCreatedUse.id);
        this.newCreatedUse = null;
      } else if(this.updatedUse) {
        this._selectNodeById(this.data, this.updatedUse.id);
        this.updatedUse = null;
      }
    })
  }

  private _selectFirstUseNode(nodes: TreeNode[]) {
    for(let i = 0; i < nodes.length; i++) {
      if(nodes[i].type === 'use') {
        this.selectedNode = nodes[i];
        return true;
      } else if(nodes[i].children) {
        const res = this._selectFirstUseNode(nodes[i].children!);
        if(res) {
          nodes[i].expanded = true;
          return true;
        }
      }
    }
    return false;
  }

  private _selectNodeById(nodes: TreeNode[], id: number) {
    for(let i = 0; i < nodes.length; i++) {
      if(nodes[i].type === 'use' && nodes[i].data === id) {
        this.selectedNode = nodes[i];
        return true;
      } else if(nodes[i].children) {
        const res = this._selectNodeById(nodes[i].children!, id);
        if(res) {
          nodes[i].expanded = true;
          return true;
        }
      }
    }
    return false;
  }

  private _selectNode(node: TreeNode){
    if(node.type === 'use') {
      this.selectedNode = node;
    } else {
      node.expanded = !node.expanded;
    }
  }

  onNodeSelect(event: any){
    this._selectNode(event.node);
  }

  search(event: any){
    if(event.query.length > 2) {
      this.suggestions = this.coreService.digitalUses.filter((use: DigitalUse) => {
        const titleTest = use.title.toLowerCase().indexOf(event.query.toLowerCase()) > -1
        const tagTest = use.tags.filter((tag: any) => tag.toLowerCase().indexOf(event.query.toLowerCase()) > -1).length > 0;
        return titleTest || tagTest;
      });
    }
  }

  onSuggestionSelect(use: DigitalUse){
    this._selectNodeById(this.data, use.id);
  }


  useSaved(use: DigitalUse) {
    this.updatedUse = use;
    this.coreService.loadDigitalUses();
    this.saving = true;
    this.saved = false;
    setTimeout(() => {
      this.saving = false;
      this.saved = true;
      setTimeout(() => {
        this.saved = false;
      }, 1000);
    }, 2000);
  }


  removeDigitalUse(event: Event, useId?: DigitalUse) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Êtes-vous sûr de vouloir supprimer cette fiche usage ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      acceptIcon: 'pi pi-check',
      rejectLabel: 'Non',
      rejectIcon: 'pi pi-times',
      accept: () => {
        this.coreService.deleteDigitalUse(useId || this.selectedNode!.data).subscribe(_ => {
          this.coreService.loadDigitalUses();
        });
      },
      reject: () => {}
    });
  }

  newDigitalUse() {
    this.selectedNode = null;
    this.digitalUseCreation = true;
  }

  createDigitalUse(data: any) {
    this.coreService.createDigitalUse(data).subscribe((use: DigitalUse) => {
      this.digitalUseCreation = false;
      this.newCreatedUse = use;
      this.coreService.loadDigitalUses();
    });
  }

}
