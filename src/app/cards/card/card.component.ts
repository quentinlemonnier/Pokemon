import { Component, OnInit, Input } from '@angular/core';
import { PokemonService } from '../../pokemon.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() card: any;
  price: string;

  constructor(
    private pokemon: PokemonService
  ) { 
  }

  ngOnInit(): void {
    this.price = this.pokemon.getCardPrice(this.card);
  }

}
