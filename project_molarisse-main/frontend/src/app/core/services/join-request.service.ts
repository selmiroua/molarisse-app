import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JoinRequestService {
  private apiUrl = `${environment.apiUrl}/api/join-requests`;

  constructor(private http: HttpClient) {}

  submitRequest(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getCurrentUserRequest(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current`);
  }

  getPendingRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`);
  }

  updateRequestStatus(requestId: number, status: string, comments?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${requestId}/status`, { status, comments });
  }
}
