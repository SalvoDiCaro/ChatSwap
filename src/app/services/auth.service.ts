import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private storage: Storage) {}

  signUp = (nickname: string, phone: string, password: string) => 
    this.http
      .post(`${environment.apiLink}/auth/signup`, { nickname, phone, password })
      .toPromise();

  signIn = (nickname: string, password: string) =>
    this.http
      .post(`${environment.apiLink}/auth/signin`, { nickname, password })
      .toPromise() as Promise<{ accessToken: string, id: string }>;
}
