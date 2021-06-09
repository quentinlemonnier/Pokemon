import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { PokemonService } from "src/app/pokemon.service";

@Injectable()
export class CardDetailsResolver implements Resolve<any> {
  constructor(
    private pokemon: PokemonService,
    ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<any> {
    const id = route.paramMap.get('id');
    return this.pokemon.getCardById(id);
  }
}