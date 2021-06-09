import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { CardsComponent } from './cards/cards.component';
import { FiltersComponent } from './cards/filters/filters.component';
import { CardComponent } from './cards/card/card.component';

import { HttpClientModule } from '@angular/common/http';
import { FilterComponent } from './cards/filters/filter/filter.component';

import { ReactiveFormsModule } from '@angular/forms';
import { CardDetailsComponent } from './card-details/card-details.component';
import { CardDetailsResolver } from './card-details/card-details.resolver';
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';
import { PokeballComponent } from './ico/pokeball/pokeball.component';
import { CartStateComponent } from './cart/cart-state/cart-state.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CardsComponent,
    FiltersComponent,
    CardComponent,
    FilterComponent,
    CardDetailsComponent,
    FooterComponent,
    CartComponent,
    PokeballComponent,
    CartStateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [CardDetailsResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
