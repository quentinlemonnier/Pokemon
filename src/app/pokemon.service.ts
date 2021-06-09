import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  API: string = '/api';
  _cards: any[] = [];
  cards$: Observable<Object>;
  _filters: any = {};
  _query: string = '?';
  query$: Subject<string> = new Subject<string>();
  _page: number = 1;
  _nextPage: number = 2;
  _queryOpt: any = {
    page: 1
  };
  pageSize: number = 4;

  constructor( private http: HttpClient ) { 
    this.cards$ = new Observable(this.cardObserver.bind(this));
  }

  getLoadingCard(){
    let res = [];
    for(var i = 0; i < this.pageSize; i++){
      res.push({
        loading: true
      })
    }
    return res;
  }

  cardObserver(observer){
      observer.next(this._cards);
      let _query$ = this.query$.pipe(
        distinctUntilChanged()
      ).subscribe((params)=>{
          /*
           * TODO: this._cards.push(...this.getLoadingCard());
           * PUSH LOADING CARDS
           */
          if(this._page === this._nextPage){
            return;
          }
          this.http.get(this.API+'/cards'+params).subscribe({
            next: (d: any) => {
              this._page = this._nextPage;
              this._nextPage++;
              this._cards.push(...d.data)
              observer.next(this._cards);
            },
            error: (err) => {
              observer.error(err);
            }
          })
      })

      return {
        unsubscribe() {
          _query$.unsubscribe()
        }
      };
  }

  getCards(){
    return this.cards$;
  }

  getRarities(opt: any){
    return this.http.get(this.API+'/rarities')
  }

  getTypes(opt: any){
    return this.http.get(this.API+'/types')
  }

  getSubtypes(opt: any){
    return this.http.get(this.API+'/subtypes')
  }

  getSupertypes(opt: any){
    return this.http.get(this.API+'/supertypes')
  }
  
  getCardPriceNumber(card: any): number{
    let prices: number[] = [0];
    if(card.tcgplayer && card.tcgplayer.prices){
      Object.keys(card.tcgplayer.prices).forEach((price: any)=>{
        prices.push(card.tcgplayer.prices[price].market);
      })
    }
    return Math.max(...prices);
  }
  getCardPrice(card: any): string{
    return '$ '+this.getCardPriceNumber(card);
  }
  
  get filtersOpt(){
    return [{
      name: 'Super Types',
      param: 'supertype'
    }, {
      name: 'Types',
      param: 'types'
    }, {
      name: 'Sub Types',
      param: 'subtypes'
    }, {
      name: 'Rarities',
      param: 'rarity'
    }];
  }
  get filters(){
    return this.filtersOpt.map((v)=> v.name);
  }

  runQuery(){
    this.query$.next(this._query);
  }

  next(){
    this._queryOpt['page'] = this._page++;
    this._queryOpt['reset'] = false;
    this.buildQuery(this._queryOpt);
  }

  get currentPage(): number{
    return this._page;
  }

  get nextPage(): number{
    return this._nextPage;
  }

  buildQuery(opt: any){

    let query = "?";
    if(opt.reset){
      this._cards = [];
      this._page = 0;
      this._nextPage = 1;
      opt['page'] = 1;
    }
    if(opt.page){
      this._page = opt.page;
      this._nextPage = opt.page+1;
    }
    query+='page='+this._page+'&pageSize='+this.pageSize;

    let keys = Object.keys(opt.filters ? opt.filters : {});
    let queryI = 0;
    let queryLength = keys.reduce(( a: number, c: string, i: number) => {
      if(opt.filters[c].length > 0){
        return a + 1;
      }else{
        return a;
      }
    },0);

    if(opt.search || queryLength > 0){
      query+='&q=';
    }
   
    if(opt.search){
      query+='(name:"'+opt.search+'")'
    }
    if(opt.search && queryLength > 0){
      query+=' AND ';
    }
    keys.forEach((param)=>{
      let paramOpt = this.filtersOpt.find((el)=>{
        return el.name == param;
      })
      if(opt.filters[paramOpt.name].length > 0){
        query+= '(';
        opt.filters[paramOpt.name].forEach((qEl, index: number) => {
          query+= paramOpt.param+':"'+qEl+'"';
          if(index < (opt.filters[paramOpt.name].length-1)){
            query+= ' OR ';
          }
        });
        query+= ')';
        if(queryI < (queryLength-1)){
          query+=' AND ';
        }
        queryI++;
      }
    });
    this._query = query;
    this._queryOpt = opt;
    this.runQuery();
    return query;
  }

  getFilter(filterId: string,opt: any){
    switch(filterId){
      case 'Super Types':
        return this.getSupertypes(opt);
      case 'Types':
        return this.getTypes(opt);
      case 'Sub Types': 
        return this.getSubtypes(opt);
      case 'Rarities': 
        return this.getRarities(opt);
      default: 
        return of([]); 
    }
  }

  getCardById(id:string){
    console.log(id);
    return this.http.get(this.API+'/cards/'+id);
  }

  cardToCart(card: any, quantity?: number): Product{
    return {
      id: card.id,
      name: card.name,
      price: this.getCardPriceNumber(card),
      quantity: quantity ? quantity : 0,
      image: card.images.small
    };
  }

}