import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entry, EntryPayload } from '../models/entry.model';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  createEntry(payload: EntryPayload): Observable<Entry> {
    return this.http.post<Entry>(`${this.apiUrl}/entries`, payload, {
      headers: this.authHeaders()
    });
  }

  getEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.apiUrl}/entries`, {
      headers: this.authHeaders()
    });
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }
}
