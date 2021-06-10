import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardDetailsComponent } from './card-details/card-details.component';
import { CardDetailsResolver } from './card-details/card-details.resolver';
import { CardsComponent } from './cards/cards.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: CardsComponent
}, {
  path: 'card/:id/:name',
  component: CardDetailsComponent,
  resolve: {
    card: CardDetailsResolver
  },
}, {
  path: 'cart',
  component: CartComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
    scrollOffset: [0,0]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
