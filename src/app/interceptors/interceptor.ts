import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
} from '@angular/common/http';

import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
  loggedRoute = ['/users','/chats','/messages','/translates'];

  baseHeader: HttpHeaders = new HttpHeaders({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Accept: 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json; charset=utf-8',
  });

  constructor(
    private storageService: StorageService
  ) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      this.loggedRoute.some((endpoint) => httpRequest.url.includes(endpoint))
    ) {      
      return from(this.storageService.get('accessToken')).pipe(
        switchMap(accessToken => {
          httpRequest = httpRequest.clone({
            headers: this.baseHeader.set(
              'Authorization',
              `Bearer ${accessToken}`
            ),
          });
          return next.handle(httpRequest);
        })
      );
    } else {
      return next.handle(httpRequest);
    }
  }
}
