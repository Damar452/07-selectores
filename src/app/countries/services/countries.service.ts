import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CountrySmall, Country } from '../interfaces/countries.interface';
import { combineLatest, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = "https://restcountries.eu/rest/v2"
  private _regions:string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[]{
    return [...this._regions ];
  }

  constructor(private http: HttpClient) { }

  getCountriesForRegion(region:string): Observable<CountrySmall[]>{
    const url: string = `${this.baseUrl}/region/${region}?fields=alpha3Code;name`;
    return this.http.get<CountrySmall[]>(url);
  }

  getCountryForCode(code: string): Observable<Country | null>{
    if(!code){
      return of(null)
    }
    const url: string = `${this.baseUrl}/alpha/${code}`;
    return this.http.get<Country>(url);
  }

  getCountryForCodeSmall(code: string): Observable<Country>{
    const url: string = `${this.baseUrl}/alpha/${code}?fields=alpha3Code;name`;
    return this.http.get<Country>(url);
  }

  getContriesForBorders(borders: string[]): Observable<CountrySmall[]>{

    if(!borders){
      return of([]);
    }
    
    const peticiones: Observable<CountrySmall>[] = [];
    borders.forEach(codigo =>{
      const peticion = this.getCountryForCodeSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
  


}
