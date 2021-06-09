import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  products: Product[] = [];
  total: number = 0;
  count: number = 0;

  total$: Subject<number> = new Subject();
  productsQuantity$: Subject<number> = new Subject();

  constructor() { }

  findItem(product: Product): Product | undefined {
    return this.products.find((p,i)=>{
      return p.name == product.name && p.id == product.id
    });
  }

  addItem(product: Product, quantity: number): void{

    let p = this.findItem(product);
    if(p){
      this.updateItemQuantity(p, p.quantity + product.quantity)
    }else{
      this.products.push(product);
    }
    this.update();
  }
  
  removeItem(product: Product): void{
    let p = this.findItem(product);
    if(p){
      this.products.splice(this.products.indexOf(p), 1);
    }
    this.update();
  }

  updateItemQuantity(product: Product, quantity: number): void{
    let p = this.findItem(product);
    if(p){
      this.products[this.products.indexOf(p)].quantity = quantity;
    }
    this.update();
  }

  roundPrice(price: number): number{
    return parseFloat(price.toFixed(2));
  }

  update(){
    this.count = this.products.length;
    this.productsQuantity$.next(this.count);
    this.total = this.products.reduce((a: number, p: Product)=>{
      return a + (p.price * p.quantity);
    }, 0)
    this.total$.next(this.roundPrice(this.total));
  }

  getCart(){
    return this.products;
  }

  calcVAT(total: number){
    return (total/100)*20;
  }

}
