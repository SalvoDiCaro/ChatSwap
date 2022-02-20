import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  account: any;

  accountId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.accountId = this.route.snapshot.paramMap.get('id');

    this.getAccount(this.accountId);
  }

  getAccount = async (index) => {
    try {
      this.account = await this.apiService.getUser(index);

      console.log(this.account);
    } catch (err) {
      console.log(err);
      await this.errorToast();
    }
  };

  async errorToast() {
    const toast = await this.toastController.create({
      message: 'Errore, riprova.',
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

}
