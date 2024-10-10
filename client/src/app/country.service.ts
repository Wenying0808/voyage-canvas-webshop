import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Country {
    name: { common: string };
    cca3: string;
}

@Injectable({
    providedIn: 'root'
})

export class CountryService {
    private apiUrl = 'https://restcountries.com/v3.1/all';
  
    constructor(private http: HttpClient) {}
  
    getCountries(): Observable<{ name: string; code: string }[]> {
      return this.http.get<Country[]>(this.apiUrl).pipe(
        map(countries => 
          countries.map(country => ({
            name: country.name.common,
            code: country.cca3
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
        )
      );
    }
  }