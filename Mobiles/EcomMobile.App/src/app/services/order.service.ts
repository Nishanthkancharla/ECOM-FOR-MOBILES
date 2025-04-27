import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5194/api/Order'; // ✅ Update with your API URL

  constructor(private http: HttpClient) {}

  // ✅ Fetch orders by user ID
  getOrders(userId: number, token: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // ✅ Create an order
  createOrder(order: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, order);
  }

  // ✅ Delete an order
  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${orderId}`);
  }
}
