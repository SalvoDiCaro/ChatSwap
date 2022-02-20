import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private storageService: StorageService, private router: Router) {}

  async ngOnInit() {
    await this.storageService.createStorage();

  this.router.navigate([ await this.storageService.get('accessToken') ? '/chats' : '/welcome'  ])   
  }
}
