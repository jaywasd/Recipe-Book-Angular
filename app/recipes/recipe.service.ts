import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService{
    recipesChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe('Schnitzel', 
    //     'Just Awesome!', 
    //     'https://w0.pngwave.com/png/37/96/time-out-barcelona-yola-email-recipe-email-png-clip-art.png',
    //     [
    //         new Ingredient('Meat',1),
    //         new Ingredient('French Fries',20)
    //     ]),
    //     new Recipe('Burger', 
    //     'Spicey', 
    //     'https://w0.pngwave.com/png/37/96/time-out-barcelona-yola-email-recipe-email-png-clip-art.png',
    //     [
    //         new Ingredient('Bun',2),
    //         new Ingredient('Meat',1)
    //     ])
    // ];
    private recipes: Recipe[] = [];

    constructor(private slService: ShoppingListService){}

      getRecipes(){
          return this.recipes.slice();
      }

      getRecipe(index: number){
          return this.recipes[index];
      }

      getIngredients(ingredient: Ingredient[]){
        this.slService.addIngredients(ingredient);
      }

      addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
      }

      deleteRecipe(index: number){
        this.recipes.splice(index,1);
        this.recipesChanged.next(this.recipes.slice());
      }

      setRecipes(recipes: Recipe[]){ //http
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
      }
}