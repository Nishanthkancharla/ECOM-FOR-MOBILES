import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileService {
  private apiUrl = 'https://localhost:7001/api/mobile';

  constructor(private http: HttpClient) { }

  getMobiles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMobile(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getMobilesByBrand(brand: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/brand/${brand}`);
  }

  getMobilesByPriceRange(min: number, max: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/price-range?min=${min}&max=${max}`);
  }

  addToCart(mobile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cart`, mobile);
  }

  getMobileSpecs(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/specs`);
  }
} 