import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Chat } from 'src/app/models/chat';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import { avatars } from 'src/avatars/avatars';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  loggedInfo: {id: string; nickname: string};
  chats: Chat[];
  users: User[];
  contacts: User[];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    this.loggedInfo = (
      await this.storageService.get<{ id: string; nickname: string }>(
        'loggedInfo'
      )
    );
    this.apiService.setChats(await this.apiService.getChatsByUser(this.loggedInfo.id));
        this.apiService.chats.subscribe( async(data) => {
          this.chats = data;
          this.users = (await this.apiService.getUsers());
          this.removeCurrentUser();
          this.contacts = this.users.slice(0, 5);

        })
  }

  openChat = async (user) => {
    console.log(" user", user)
    const chatExists = this.chats.find(({user1, user2}) => 
    (user1.id === user.id && user2.id === this.loggedInfo.id) ||
    (user2.id === user.id && user1.id === this.loggedInfo.id) 
    );
    if(chatExists) return this.router.navigate(['chat', chatExists.id]); 
    try{
      const idChat = (await this.apiService.newChat({user1: user, user2: this.loggedInfo})).id;
      this.apiService.setChats(await this.apiService.getChatsByUser(this.loggedInfo.id));
      this.router.navigate(['chat', idChat]);
    } catch(e){
          console.log("🚀 ~ file: chats.page.ts ~ line 68 ~ ChatsPage ~ openChat= ~ e", e)
    }
  }

  newChat = () => this.router.navigate(['users']);

  openSettings = () => this.router.navigate(['settings']);

  removeCurrentUser = () => {
    const indexUser = this.users.findIndex(({ id }) => id === this.loggedInfo.id);
    this.users.splice(indexUser, 1);
  };

  getAvatar = () => avatars[Math.floor(Math.random() * 10)];

}
