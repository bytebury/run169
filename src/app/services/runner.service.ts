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
  is_going: boolean;
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

export interface CreateRunnerRequest extends Omit<Runner, 'id' | 'town'> {
  town_id: number | string;
  email: string;
  password_digest: string;
}

export interface UpdateRunnerRequest {
  avatar_url?: string;
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

  update(request: UpdateRunnerRequest): Observable<Runner> {
    return this.http.put<Runner>(`${environment.backendUrl}/users`, request);
  }

  create(request: CreateRunnerRequest): Observable<Runner> {
    return this.http.post<Runner>(`${environment.backendUrl}/users`, request);
  }
}
