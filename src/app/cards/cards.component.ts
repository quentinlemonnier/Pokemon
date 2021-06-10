import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit, OnDestroy {

  cards = [];
  cards$;
  page: number = 0;
  search: string;
  infiniteScrollOffset: number = 128;
  scrollEv: Subject<number>;
  scrollDelay: number = 250;

  constructor( 
    private pokemon: PokemonService,
    private renderer2: Renderer2,
    private hostElement: ElementRef
  ) { 
    this.scrollEv = new Subject();
  }

  ngOnInit(): void {

    this.renderer2.listen(window, 'scroll', ($event) => {
      this.scrollHandler($event);
    })

    this.cards$ = this.pokemon.getCards().subscribe({
      next:(data: any) => {
        this.cards = data;
        this.page = this.pokemon.currentPage;
      },
      error:(err: any) => {
        console.log(err);
      }
    });

    this.next();

    this.scrollEv.pipe(
      distinctUntilChanged(),
      debounceTime(this.scrollDelay)
    ).subscribe((v)=>{
      this.next();
    })

  }

  ngOnDestroy(): void {
    this.cards$.unsubscribe();
  }

  getPos(element: Element){
    
    var rect = element.getBoundingClientRect();
    var scrollTop = document.documentElement.scrollTop?
                    document.documentElement.scrollTop:document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft?                   
                     document.documentElement.scrollLeft:document.body.scrollLeft;
    return {
      top: rect.top+scrollTop,
      left: rect.left+scrollLeft
    }
  }

  scrollHandler(event){
    if( (window.scrollY + this.getPos(this.hostElement.nativeElement).top) >= ( this.hostElement.nativeElement.offsetHeight - this.infiniteScrollOffset )){
        this.scrollEv.next(this.page);
    }
  }

  onFilters(filters: any){
    window.scrollTo(0,0);
    this.pokemon.buildQuery({
      reset: true,
      filters: filters,
      search: filters['search']
    })
  }

  next(){
    this.pokemon.next();
  }

}
