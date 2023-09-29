import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Race {
  id: number;
  name: string;
  start_date: Date | string;
  town: { id: number; name: string };
  distance: { value: string; unit: 'mile' | 'kilometer' };
  results_url?: string;
  website_url?: string;
  address_line_one?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRace
  extends Omit<Race, 'id' | 'created_at' | 'updated_at' | 'distance' | 'town'> {
  town_id: number;
  distance: string | number;
  distance_unit: 'mile' | 'kilometer';
}

@Injectable({
  providedIn: 'root',
})
export class RaceService {
  races = signal<Race[]>([]);

  constructor(private http: HttpClient) {}

  create(race: CreateRace) {
    return this.http.post(`${environment.backendUrl}/races`, race, {
      headers: {
        Authorization:
          'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozLCJleHAiOjE2OTY1NDQ4OTl9.JcmRgCS2GDoM6Rx9pHPt-89CzeEvAGS266zlcEqdWOg',
      },
    });
  }

  loadRaces(): void {
    this.http
      .get<Race[]>(`${environment.backendUrl}/races`)
      .pipe(take(1))
      .subscribe({
        next: (races: Race[]) => {
          this.races.set(races);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
