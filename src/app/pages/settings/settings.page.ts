import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { Key } from 'protractor';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { avatars } from 'src/avatars/avatars';

interface SelectChangeEventDetail<T = any> {
  value: T;
}

interface SelectCustomEvent<T = any> extends CustomEvent {
  detail: SelectChangeEventDetail<T>;
  target: HTMLIonSelectElement;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    languages = [
    {key: "it", value:"Italian"},
    {key: "ar", value:"Arabic"},
    {key: "bg", value:"Bulgarian"},
    {key: "cs", value:"Czech"},
    {key: "de", value:"German"},
    {key: "fr", value:"French"},
    {key: "la", value:"Latin"},
    {key: "zh", value:"Chinese"},
    {key: "ja", value:"Japanese"},
  ]
  
  currentLanguage: string;
  loggedId: string;
  myNickname: string;
  settings: any;
  selectLanguage: FormControl = new FormControl();
  avatars = avatars;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
  this.currentLanguage = await this.storageService.get<string>('language');
  this.myNickname = (
    await this.storageService.get<{ id: string; nickname: string }>(
      'loggedInfo'
    )
  ).nickname;
  }

  // getSettings = async () => {
  //   try {
  //     this.settings = await this.apiService.me();
  //   } catch (err) {
  //     console.log(err);
  //     await this.errorToast();
  //   }
  // };

  setLanguage = ({detail: {value}}: SelectCustomEvent) => {
    this.storageService.set('language', value);
    
  }

  async logoutActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Vuoi effettuare il logout?',
      backdropDismiss: true,
      buttons: [
        {
          text: 'Esci',
          icon: 'exit',
          handler: async () => {
            await this.logout();
          },
        },

        {
          text: 'Annulla',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  async successToast() {
    const toast = await this.toastController.create({
      message: 'Logout effettuato!',
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: 'Errore, riprova.',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  logout = async () => {
    try {
      await this.storageService.clear();

      await this.successToast();
      console.log("🚀 ~ file: settings.page.ts ~ line 125 ~ SettingsPage ~ logout= ~ this.storageService.clear();", await  this.storageService.get('loggedInfo'))

      this.router.navigate(['/welcome']);
    } catch (err) {
      console.log(err);

      await this.errorToast();
    }
  };

  getAvatar = () => avatars[Math.floor(Math.random() * 10)];
}
