import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private myStorage: Storage;
  constructor(private storage: Storage) {}

  createStorage = async () =>
    !this.myStorage && (this.myStorage = await this.storage.create());

  get = <T>(key: 'accessToken' | 'loggedInfo' | 'language'):Promise<T> => this.myStorage!.get(key);

  set = (key: 'accessToken' | 'loggedInfo' | 'language', value: any) => this.myStorage!.set(key, value);

  clear = () => this.myStorage!.clear();
}
