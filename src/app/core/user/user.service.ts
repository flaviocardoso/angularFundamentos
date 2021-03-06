import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';
import * as jwt_decoder from 'jwt-decode';

@Injectable({providedIn: 'root'})
export class UserService {
    private userSubject = new BehaviorSubject<User>(null);
    private userName: string;
    private user: User;

    constructor(private tokenService: TokenService) {
        // tslint:disable-next-line: no-unused-expression
        this.tokenService.hasToken() &&
            this.decodeAndNotify();
    }

    setToken (token: string) {
        this.tokenService.setToken(token);
        this.decodeAndNotify();
    }

    getToken () {
        return this.userSubject.asObservable();
    }

    private decodeAndNotify() {
        const token = this.tokenService.getToken();
        const user = jwt_decoder(token) as User;
        this.user = user;
        this.userName = user.name;
        this.userSubject.next(user);
    }

    logout () {
        this.tokenService.removeToken();
        this.userSubject.next(null);
    }

    islogged () {
        return this.tokenService.hasToken();
    }

    getUserName () {
        return this.userName;
    }
}
