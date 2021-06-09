import { Component, Input, OnInit } from '@angular/core';
import { CartService } from 'src/app/cart.service';

@Component({
  selector: 'app-cart-state',
  templateUrl: './cart-state.component.html',
  styleUrls: ['./cart-state.component.scss']
})
export class CartStateComponent implements OnInit {

  @Input('defaultString') defaultString: boolean;
  quantity: number = 0;
  amount: number = 0;

  constructor(
    private cart: CartService
  ) { }

  ngOnInit(): void {
    this.cart.total$.subscribe((amount)=>{
      this.amount = amount;
    })
    this.cart.productsQuantity$.subscribe((quantity)=>{
      this.quantity = quantity;
    })
  }
}
