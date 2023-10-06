import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RaceResult } from './race-result.service';
import { AuthenticationService } from './authentication.service';

export interface Race {
  id: number;
  name: string;
  start_time: Date | string;
  town_id: number;
  town_name: string;
  distance: string | number;
  distance_unit: 'mi' | 'km';
  logo_url?: string;
  results_url?: string;
  website_url?: string;
  address_line_one?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRace
  extends Omit<Race, 'id' | 'created_at' | 'updated_at' | 'town_name'> {
  town_id: number;
  distance: string | number;
  distance_unit: 'mi' | 'km';
  start_time: string;
}

@Injectable({
  providedIn: 'root',
})
export class RaceService {
  races = signal<Race[]>([]);

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  create(race: CreateRace) {
    return this.http.post(`${environment.backendUrl}/races`, race);
  }

  find(raceId: string): Observable<Race> {
    return this.http.get<Race>(`${environment.backendUrl}/races/${raceId}`);
  }

  findUpcomingRaces(): Observable<Race[]> {
    return this.http.get<Race[]>(`${environment.backendUrl}/races/upcoming`);
  }

  findResultsByRace(raceId: string | number): Observable<RaceResult[]> {
    return this.http.get<RaceResult[]>(
      `${environment.backendUrl}/races/${raceId}/results`
    );
  }

  findWatchers(raceId: string | number): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.backendUrl}/races/${raceId}/watchers`
    );
  }

  watch(raceId: string | number): Observable<any> {
    return this.http.post<any>(
      `${environment.backendUrl}/races/${raceId}/watchers`,
      {
        race_id: raceId,
        user_id: this.auth.currentUser()?.id,
      }
    );
  }

  removeWatch(raceId: string | number): Observable<any> {
    return this.http.delete<any>(
      `${environment.backendUrl}/races/${raceId}/watchers`,
      {
        body: {
          user_id: this.auth.currentUser()?.id,
        },
      }
    );
  }

  loadPreviousRaces(): void {
    this.http
      .get<Race[]>(`${environment.backendUrl}/races/previous`)
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
