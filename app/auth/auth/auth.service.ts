import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError,tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from "./user.model";
import { Router } from '@angular/router';

export interface AuthResposeData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService{
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router){}

    signup(email: string, password: string){
        return this.http.post<AuthResposeData>('', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(resData);
            })
        );
    }

    login(email: string, password: string){
        return this.http.post<AuthResposeData>('', {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(resData);
            })
        );
    }

    autoLogin(){
        const userData:{
            email: string;
            id: string;
            _token: string;
            _tokenExperationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return; 
        }
        const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExperationDate)
        );

        if(loadedUser.token){
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExperationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
          this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(resData){  
        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        const user = new User(
            resData.email,
            resData.localId,
            resData.idToken, 
            expirationDate
            );
        this.user.next(user);
        this.autoLogout(+resData.expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse){
            let errorMsg = 'An unknown Error Occurred!';
            if(!errorRes.error || !errorRes.error.error){
                return throwError(errorMsg);
            }
            switch(errorRes.error.error.message){
                case 'EMAIL_EXISTS':
                    errorMsg = 'This email exists already';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMsg = 'Email does not exist';
                    break;
                case 'INVALID_PASSWORD':
                    errorMsg = 'This Password is not correct';
                    break;    
            }
            return throwError(errorMsg);
    }
}
