import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from "../shared/ingredient.model";
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import {ShoppingListService} from './shopping-list.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'], 
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private igChangeSub : Subscription;

  constructor(private shoppinglistService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.shoppinglistService.getIngredients();
    this.igChangeSub = this.shoppinglistService.ingredientChanged.subscribe(
    (ingredient: Ingredient[]) => {this.ingredients = ingredient});
  }

  onEditItem(index: number){
    this.shoppinglistService.startedEditing.next(index);
  }

  ngOnDestroy(){
    this.igChangeSub.unsubscribe();
  }

}
