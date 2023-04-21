import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RemoteAccess } from 'src/app/models/client';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-client-settings',
  templateUrl: './client-settings.component.html',
  styleUrls: ['./client-settings.component.scss']
})
export class ClientSettingsComponent implements OnInit {

  user?: User | null;

  remoteAccesses?: RemoteAccess[] = [];
  newRemoteAccessDialogVisible = false;

  newRemoteAccessForm: FormGroup = this.fb.group({})
  errors: any = {};

  syncing = false;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private coreService: CoreService,
  ) { }

  ngOnInit(): void {
    this.newRemoteAccessForm = this.fb.group({
      name: [''],
      serverUrl: [''],
      apiKey: [''],
    });

    this.clientService.remoteAccesses$.subscribe(remoteAccesses => {
      this.remoteAccesses = remoteAccesses;
    });

    this.authService.user$.subscribe((x) => (this.user = x));
  }

  openRemoteAccessDialog() {
    this.newRemoteAccessForm.reset();
    this.newRemoteAccessDialogVisible = true;
  }

  createRemoteAccess() {
    this.clientService.createRemoteAccess(this.newRemoteAccessForm.value).subscribe({
      next : (resp: any) => {
      this.newRemoteAccessDialogVisible = false;
      this.messageService.add({ severity: 'success', detail: resp.msg });
      this.clientService.fetchRemoteAccesses();
    },
    error :(error : any) => {
      this.errors = error.error;
    }});
  }

  synchronize(remoteAccess: RemoteAccess) {
    this.syncing = true;
    this.clientService.synchronizeRemoteAccess(remoteAccess.id).subscribe({
      next : (resp: any) => {
        this.messageService.add({ severity: 'success', detail: resp.msg });
        this.coreService.loadDigitalUses();
        this.syncing = false;
      },
      error :(error : any) => {
        this.messageService.add({ severity: 'error', detail: error.error.msg });
        this.syncing = false;
      }});

  }

  deleteRemoteAccess(event: Event, remoteAccess: RemoteAccess) {
    event.stopPropagation();
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Êtes-vous sûr de vouloir supprimer ce service ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      acceptIcon: 'pi pi-check',
      rejectLabel: 'Non',
      rejectIcon: 'pi pi-times',
      accept: () => {
        this.clientService.deleteRemoteAccess(remoteAccess.id).subscribe(() => {
          this.clientService.fetchRemoteAccesses();
        });
      },
      reject: () => {},
    });


  }

}
