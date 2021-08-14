import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { CountrySmall, Country } from '../../interfaces/countries.interface';
import { switchMap, tap } from 'rxjs/operators'

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
    // dis: [{value:'', disable:true}, Validators.required]
  })

  regions:string[] = [];
  countries: CountrySmall[] = [];
  borders: CountrySmall[] = [];
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private countriesService: CountriesService) { }

  ngOnInit(): void {
    this.regions = this.countriesService.regions;

    // switchMap 1A
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( (_) => {
          this.miFormulario.get('country')?.reset('');
          this.cargando = true;
      } ),
      switchMap(region => this.countriesService.getCountriesForRegion(region))
    ). subscribe(countries => {
      this.countries = countries; 
      this.cargando = false;
    } );

    this.miFormulario.get('country')?.valueChanges
    .pipe(
      tap( (_) => {
        this.miFormulario.get('border')?.reset('');
        this.cargando = true;
    } ),
      switchMap(code => this.countriesService.getCountryForCode(code)),
      switchMap(country => this.countriesService.getContriesForBorders(country?.borders!))
    )
    .subscribe(countries =>{
      // this.borders = country?.borders || [];
      this.borders = countries;
      this.cargando = false;
    })

  }

  guardar(){
    console.log(this.miFormulario.value); 
  }

}
