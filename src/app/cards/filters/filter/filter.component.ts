import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { PokemonService } from 'src/app/pokemon.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Input('filter') filter: string;
  @Input('parentForm') parentForm: FormGroup;
  value: FormArray;
  values: string[] = [];
  open: boolean = false;
  data: string[];
  filterType: string;

  constructor(
    private pokemon: PokemonService
  ) { 
  }

  get id(){
    return this.filter;
  }

  ngOnInit(): void {
    this.filterType = this.filter;
    this.pokemon.getFilter(this.id, {}).subscribe((d: any)=>{
      this.data = d.data;
      this.value = this.parentForm.get(this.filter) as FormArray;

    });
  }

  onCheckboxChange(e) {
    if (e.target.checked) {
      this.value.push(new FormControl(e.target.value));
      this.values.push(e.target.value);
    } else {
      let i: number = 0;
      this.value.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          this.value.removeAt(i);
          this.values.splice(i,1);
          return;
        }
        i++;
      });
    }
  }

  isChecked(filter: string){
    if(this.values.indexOf(filter) >= 0){
      return true;
    }else{
      return false;
    }
  }

  toggle(){
    this.open = !this.open;
  }

  hide(){
    this.open = false;
  }

  show(){
    this.open = true;
  }

  getSetImage(setName: string){
    let set = this.pokemon.getSetData(setName);
    if(set){
      return set.images.logo
    }else{
      return null;
    }
  }

}
