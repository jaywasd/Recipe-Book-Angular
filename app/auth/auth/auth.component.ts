import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from "./auth.service";
import { Observable } from 'rxjs';
import { AuthResposeData } from "./auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    let authObs: Observable<AuthResposeData>;

    if(this.isLoginMode){
      authObs = this.auth.login(email,password);
    }else{
      authObs = this.auth.signup(email,password);
    }

    authObs.subscribe(response => {
      console.log(response);
      this.isLoading = false;
      this.router.navigate(['./recipes']);
    }, errorMsg => {
      console.log(errorMsg);
      this.error = errorMsg;
      ;
      this.isLoading = false;
    });

    form.reset();
  }
}
