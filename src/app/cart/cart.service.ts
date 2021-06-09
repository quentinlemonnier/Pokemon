import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from 'src/app/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  products: Product[] = [];
  count: number = 0; 
  total: number = 0;

  constructor() { }

  addItem(product: Product){
    let isInCart = this.products.find((p,i)=>{
      return p.name == product.name && p.id == product.id
    });
    if(isInCart){
      this.updateItemQuantity(this.products[this.products.indexOf(isInCart)], isInCart.quantity + product.quantity);
    }else{
      this.products.push(product);
    }
    this.update();
  }
  
  removeItem(product: Product){
    let p = this.products.indexOf(product);
    this.products.splice(p,1);
    this.update();
  }

  updateItemQuantity(product: Product, quantity: number){
    let p = this.products.find((p,i)=>{
      return p.name == product.name && p.id == product.id
    });
    if(p){
      this.products[this.products.indexOf(p)]['quantity'] = quantity;
    }
    this.update();
  }

  update(){
    this.count = this.products.length;
    this.productsQuantity$.next(this.count);
    
    this.total = this.products.reduce((a: number, p: Product, i:number)=>{
      return a + (p.price * p.quantity);
    },0);
    this.total$.next(
      this.total
    );
  }

  total$: Subject<number> = new Subject();
  productsQuantity$: Subject<number> = new Subject();
}
