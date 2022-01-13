import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators'
import { AuthService } from '../auth/auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService{
    constructor(private http: HttpClient, private recipes: RecipeService, private auth: AuthService){}
    
    
    storeRecipes(){
        const recipes = this.recipes.getRecipes();
        if(recipes !==[] ){
            
        }
        this.http.put('https://angularproject-wasd.firebaseio.com/recipes.json', recipes)
        .subscribe( response => {
            console.log(response);
        });
    }  

    fetchRecipes(){
            return this.http.get<Recipe[]>('https://angularproject-wasd.firebaseio.com/recipes.json', //?auth=' + user.token
        ).pipe(
        map(recipes => {
            return recipes.map(recipes => {
                return {...recipes, ingredients: recipes.ingredients ? recipes.ingredients : [] }
            });
        }),
        tap(recipes => {
            this.recipes.setRecipes(recipes);
        }));
    }
}