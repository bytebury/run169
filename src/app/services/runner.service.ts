import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Town } from './town.service';
import { RaceResult } from './race-result.service';
import { Race } from './race.service';

export interface WatchList {
  id: number;
  race?: Race;
}

export interface Runner {
  id: number;
  runner_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  town: Town;
  sex: 'male' | 'female';
}

@Injectable({
  providedIn: 'root',
})
export class RunnerService {
  constructor(private http: HttpClient) {}

  find(runnerId: string): Observable<Runner> {
    return this.http.get<Runner>(
      `${environment.backendUrl}/runners/${runnerId}`
    );
  }

  findAll(): Observable<Runner[]> {
    return this.http.get<Runner[]>(`${environment.backendUrl}/runners`);
  }

  getWatchList(userId: string | number): Observable<WatchList[]> {
    return this.http.get<WatchList[]>(
      `${environment.backendUrl}/users/${userId}/watching`
    );
  }

  getResults(userId: string | number): Observable<RaceResult[]> {
    return this.http.get<RaceResult[]>(
      `${environment.backendUrl}/users/${userId}/results`
    );
  }

  getCompletedTowns(
    userId: string | number
  ): Observable<{ town_name: string; count: number }[]> {
    return this.http.get<{ town_name: string; count: number }[]>(
      `${environment.backendUrl}/users/${userId}/towns`
    );
  }
}
