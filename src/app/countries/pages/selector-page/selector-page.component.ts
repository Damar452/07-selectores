import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { CountrySmall } from '../../interfaces/countries.interface';
import { switchMap, tap } from 'rxjs/operators'

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required]
  })

  regions:string[] = [];
  countries: CountrySmall[] = [];

  constructor(private fb: FormBuilder,
              private countriesService: CountriesService) { }

  ngOnInit(): void {
    this.regions = this.countriesService.regions;

  // switchMap 1A
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( (_) => {
          this.miFormulario.get('country')?.reset('');
      } ),
      switchMap(region => this.countriesService.getCountriesForRegion(region))
    ). subscribe(countries => {
      this.countries = countries; 
    } )

  }

  guardar(){
    console.log(this.miFormulario.value); 
  }

}
