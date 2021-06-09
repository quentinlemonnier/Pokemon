import { Component, OnInit, HostListener, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from 'src/app/pokemon.service';
import { CartService } from 'src/app/cart.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {

  card: any;
  price: string;
  quantity: number = 1;
  quantityDropdown: boolean = false;

  @ViewChild("cardQuantityDropdown") dropdownElementRef: ElementRef;
  @HostListener('window:click', ['$event'])
  onClick(event: Event){
    if(event.target != this.dropdownElementRef.nativeElement){
      this.quantityDropdown = false;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private pokemon: PokemonService,
    private cart: CartService,
    private renderer: Renderer2
    ) { }

  ngOnInit(): void {
    this.route.data.subscribe((d) => {
      this.card = d.card.data;
      this.price = this.pokemon.getCardPrice(this.card);
    });
  }

  setQuantity(quantity: number){
    this.quantity = quantity;
    this.quantityDropdown = false;
  }

  addToCart(): void{
    this.cart.addItem(this.pokemon.cardToCart(this.card, this.quantity), this.quantity);
  }

}
