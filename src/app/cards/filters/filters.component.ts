import { Component, OnInit, Directive, ViewChildren, ElementRef, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { PokemonService } from 'src/app/pokemon.service';
import { FilterComponent } from './filter/filter.component';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Directive({selector: 'app-filter'})
export class AppFilter {
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  @Output("filters") filtersEvent$: EventEmitter<any> = new EventEmitter();
  @ViewChildren(FilterComponent) appFilters: QueryList<FilterComponent>;
  filters: string[] = this.pokemon.filters;
  form: FormGroup;

  constructor(
    private pokemon: PokemonService,
    private fb: FormBuilder
  ) { 
    let formObj = {};
    
    this.filters.forEach((filter)=>{
      formObj[filter] = fb.array([]);
    });

    this.form = fb.group(formObj)

  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((v)=>{
      this.filtersEvent$.emit(v);
    })
  }

  toggle(selectedFilter: string){
    this.appFilters.forEach((filter)=>{
      if(filter.id == selectedFilter){
        filter.toggle();
      }else{
        filter.hide();
      }
    })
  }

}
