import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Race } from './race.service';

export interface RaceResult {
  id: number;
  bib_number?: string;
  total_time?: string;
  hours: number;
  minutes: number;
  seconds: number;
  time_in_seconds: number;
  race: Race;
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
    return this.http.post(`${environment.backendUrl}/results`, result);
  }
}
