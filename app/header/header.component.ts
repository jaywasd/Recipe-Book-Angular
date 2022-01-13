import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service'
import { AuthService } from '../auth/auth/auth.service';
import { Subscription } from 'rxjs';
 
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(private storage: DataStorageService,private auth: AuthService){}

  ngOnInit(){
    this.userSub = this.auth.user.subscribe(user => {
      this.isAuthenticated = !!user; // !user ? false : true
    });
  }

  onSaveData(){
    this.storage.storeRecipes();
  }

  onFetchData(){
    this.storage.fetchRecipes().subscribe();
  }

  onLogout(){
    this.auth.logout();
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }
}