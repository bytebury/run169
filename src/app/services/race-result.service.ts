import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface RaceResult {
  id: number;
  bib_number?: string;
  total_time?: string;
}

export interface CreateRaceResult {
  race_id: number;
  user_id: number;
  hours: number;
  minutes: number;
  seconds: number;
  bib_number: string;
}

@Injectable({
  providedIn: 'root',
})
export class RaceResultService {
  constructor(private http: HttpClient) {}

  create(result: CreateRaceResult) {
    return this.http.post(`${environment.backendUrl}/results`, result, {
      headers: {
        Authorization:
          'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozLCJleHAiOjE2OTY1NDQ4OTl9.JcmRgCS2GDoM6Rx9pHPt-89CzeEvAGS266zlcEqdWOg',
      },
    });
  }
}
