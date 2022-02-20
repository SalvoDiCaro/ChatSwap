import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { avatars } from 'src/avatars/avatars';
import { StorageService } from 'src/app/services/storage.service';
import { User } from 'src/app/models/user';
import { Chat } from 'src/app/models/chat';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: User[];
  chats: Chat[];
  avatars = avatars;
  loggedInfo: { id: string; nickname: string };

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastController: ToastController,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    this.loggedInfo = await this.storageService.get<{
      id: string;
      nickname: string;
    }>('loggedInfo');
    this.chats = (await this.apiService.getChatsByUser(this.loggedInfo.id));
    this.users = (await this.apiService.getUsers());
    this.users = this.users.filter(({ id }) => (id !== this.loggedInfo.id));
    this.users = this.users.filter(({id}) => !this.chats.some(({user1, user2}) => 
      (user1.id === id && user2.id === this.loggedInfo.id) ||
        (user2.id === id && user1.id === this.loggedInfo.id) 
        ));
  }

  async errorToast() {
    const toast = await this.toastController.create({
      message: "Errore nell'invio del messaggio, riprova.",
      duration: 2000,
      color: 'error',
    });
    toast.present();
  }

  openChat = async (user) => {
    try {
      const idChat = (await this.apiService.newChat({ user1: user, user2: this.loggedInfo })).id
      this.apiService.setChats(await this.apiService.getChatsByUser(this.loggedInfo.id));
      this.router.navigate(['chat',idChat]);
    } catch (e) {
      console.log('e', e);
    }
  };

  getAvatar = () => avatars[Math.floor(Math.random() * 10)];
}
