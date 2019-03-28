import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { UserService } from './user.service';
import { UserRoles } from 'src/app/models/user';

@Injectable()
export class AuthGuard implements CanActivate {
    private jwtHelper = new JwtHelperService();

    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    public canActivate(route: ActivatedRouteSnapshot): boolean {
        const allowedRoles: UserRoles[] = route.data.allowedRoles;
        if (allowedRoles) {
            const userRole = this.userService && this.userService.user.role;
            const userHasRoles = allowedRoles.findIndex((role) => role === userRole) > -1;
            if (!userHasRoles) {
                this.router.navigate(['/home']);
                return false;
            }
        }
        const token = this.userService.token;
        const canLogin = token && !this.jwtHelper.isTokenExpired(token);
        if (!canLogin) {
            this.router.navigate(['/user/login']);
        }
        return canLogin;
    }
}
