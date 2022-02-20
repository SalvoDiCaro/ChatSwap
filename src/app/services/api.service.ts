import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';
import { Chat, CompleteChat } from '../models/chat';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
const { apiLink } = environment;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  chats: BehaviorSubject<Chat[]> = new BehaviorSubject([]);

  setChats = (chats: Chat[]) => this.chats.next(chats);

  getUser = (id: string) => this.http.get<Omit<User, 'password'>>(`${apiLink}/users/${id}`).toPromise();

  getUsers = () => this.http.get<User[]>(`${apiLink}/users`).toPromise();
  

  //CHAT
  getChats = () => this.http.get<Chat[]>(`${apiLink}/chats`).toPromise();

  getChatsByUser = (id: string) => this.http.get<Chat[]>(`${apiLink}/chats/user/${id}`).toPromise();


  getChat = (id: string) => this.http.get<CompleteChat>(`${apiLink}/chats/${id}`).toPromise();

  //MESSAGES
  // getMessages = () => this.http.get<Message[]>(`${apiLink}/messages`).toPromise();

  getMessages = (id: string) => this.http.get<Message[]>(`${apiLink}/messages/${id}`).toPromise();

  getChatMessages = (id: string) => this.http.get<Message[]>(`${apiLink}/messages/chat/${id}`).toPromise();

  sendMessage = (body: Omit<Message, 'id'>) => this.http.post<Message>(`${apiLink}/messages/`, body).toPromise();

  newChat = (body: Omit<Chat, 'id' | 'lastMessage'>) => this.http.post<Chat>(`${apiLink}/chats/`, body).toPromise();

  getTranslation = (body: {q: string, target: string, source: string}) => this.http.post<string>(`${apiLink}/translates/`, body, {}).toPromise();
}
