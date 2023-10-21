import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  constructor(private http: HttpClient) {}

  forgot(email: string): Observable<any> {
    return this.http.post(`${environment.backendUrl}/passwords/forgot`, {
      email,
    });
  }

  reset(request: { password: string; token: string }): Observable<any> {
    return this.http.post(`${environment.backendUrl}/passwords/reset`, request);
  }
}
