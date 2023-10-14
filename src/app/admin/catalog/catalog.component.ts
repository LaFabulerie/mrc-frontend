import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { DigitalUse, Item } from 'src/app/models/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CoreService } from 'src/app/services/core.service';
import { ImportExportDialogComponent } from '../components/import-export-dialog/import-export-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit{

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  user?: User | null;

  data: TreeNode[] = [];
  selectedNode!: TreeNode | null;
  suggestions: any[] = [];

  firstLoad: boolean = true;
  saving: boolean = false;
  saved: boolean = false;

  digitalUseCreation: boolean = false;
  newCreatedUse: DigitalUse | null = null;
  updatedUse: DigitalUse | null = null;

  uploadUrl = `${environment.serverHost}/api/w/import/`

  constructor(
    private coreService: CoreService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private dialogService: DialogService,
    private messageService: MessageService,
  ) {
    this.authService.user$.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.coreService.digitalUses$.subscribe((uses: DigitalUse[]) => {
      this.data = [];
      uses.forEach((use: DigitalUse) => {
        const newUse = {
          label: use.title,
          data: use.uuid,
          type: 'use',
          icon: 'pi pi-file',
          leaf: true
        }
        use.items.forEach((item: Item) => {
          let room = this.data.find((node: TreeNode) => node.type === 'room' && node.data === item.room.uuid)
          if(!room) {
            this.data.push({
              label: item.room.name,
              data: item.room.uuid,
              type: 'room',
              expandedIcon: 'pi pi-folder-open',
              collapsedIcon: 'pi pi-folder',
              children: [{
                label: item.name,
                data: item.uuid,
                type: 'item',
                expandedIcon: 'pi pi-folder-open',
                collapsedIcon: 'pi pi-folder',
                children: [newUse]
              }]
            });
          } else {
            let _item = room.children!.find((node: TreeNode) => node.type === 'item' && node.data === item.uuid);
            if(!_item) {
              room.children!.push({
                label: item.name,
                data: item.uuid,
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

      if(this.firstLoad && this.data.length > 0){
        this._selectFirstUseNode(this.data);
        this.firstLoad = false;
      } else if(this.newCreatedUse) {
        this._selectNodeById(this.data, this.newCreatedUse.uuid);
        this.newCreatedUse = null;
      } else if(this.updatedUse) {
        this._selectNodeById(this.data, this.updatedUse.uuid);
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

  private _selectNodeById(nodes: TreeNode[], uuid: string) {
    for(let i = 0; i < nodes.length; i++) {
      if(nodes[i].type === 'use' && nodes[i].data === uuid) {
        this.selectedNode = nodes[i];
        return true;
      } else if(nodes[i].children) {
        const res = this._selectNodeById(nodes[i].children!, uuid);
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
    this.digitalUseCreation = false;
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
    this._selectNodeById(this.data, use.uuid);
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

  import(){
    const ref = this.dialogService.open(ImportExportDialogComponent, {
      header: 'Importer',
      width: '70%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      position: "top",
      data: {
        action: 'import'
      }
    });
    ref.onClose.subscribe(_ => {
      this.coreService.loadDigitalUses();
    });
  }

  export(){
    const ref = this.dialogService.open(ImportExportDialogComponent, {
      header: 'Exporter',
      width: '70%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      position: "top",
      data: {
        action: 'export'
      }
    });
    ref.onClose.subscribe(_ => {
      this.coreService.loadDigitalUses();
    });
  }

  onUpload($event: any){
    this.messageService.add({ severity: 'success', summary: 'Import réussi', detail: 'Le fichier a bien été importé' });
    this.fileUpload.clear();
    this.coreService.loadDigitalUses();
  }

  onUploadError($event: any){
    if($event.error.status === 500) {
      this.messageService.add({ severity: 'error', summary: 'Erreur d\'import', detail: 'Une erreur est survenue lors de l\'import.\n\
       Veuillez vérifier le format de votre fichier d\'import et réessayer' });
    }
    else if($event.error.error.messages && $event.error.error.messages.length > 5) {
      this.messageService.add({ severity: 'error', summary: 'Erreur d\'import', detail: 'Plus de 5 services existent déjà.\n\
       Veuillez vérifier votre fichier d\'import et/ou supprimer les services que vous souhaitez ré-impoter' });
    } else {
      for(let msg of $event.error.error.messages) {
        this.messageService.add({ severity: 'error', summary: 'Erreur d\'import', detail: msg, sticky: true });
      }
    }
    this.fileUpload.clear();
  }

}
