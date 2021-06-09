import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/product';
import { CartService } from 'src/app/cart.service'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  products: Product[] = [];
  amount: string = '$ 0';
  vat: string = '$ 0';
  constructor(
    private cart: CartService
  ) { 
    this.update();
  }

  ngOnInit(): void {
  }

  totalByItem(qty: number, price: number): number{
    return this.cart.roundPrice( qty * price ); 
  }

  delete(product: Product){
    this.cart.removeItem(product);
    this.update();
  }

  update(){
    this.products = this.cart.getCart();
    this.amount = '$ '+this.cart.roundPrice(this.cart.total);
    this.vat = '$ '+this.cart.roundPrice(this.cart.calcVAT(this.cart.total));
  }

}
