import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of as observableOf } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private userService: UserService) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return observableOf(this.userService.token).pipe(
            switchMap((token: string) => {
                let copiedReq = null;
                if (token) {
                    copiedReq = req.clone({
                        setHeaders: {
                            Authorization: token
                        }
                    });
                }

                return next.handle(copiedReq || req);
            }));
    }
}
