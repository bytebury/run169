import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface WatchList {
  id: number;
  user_id: number;
  race_id?: number;
}

export interface Runner {
  id: number;
  runner_id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  town_id: number;
  hometown_name: string;
  sex: 'male' | 'female';
}

export interface RunnerInfo {
  user: Runner;
  results: {
    id: number;
    race_id: number;
    user_id: number;
    bib_number: string;
    hours: number;
    minutes: number;
    seconds: number;
    mile_pace: string;
    kilometer_pace: string;
    created_at: Date | string;
    name: string;
    distance: string;
    distance_unit: 'km' | 'mi';
    address_line_one?: string;
    town_id: number;
    town_name: string;
    start_time: Date | string;
    source: 'manual' | 'run_signup';
    website_url?: string;
    results_url?: string;
    date_only: Date | string;
  }[];
  towns: {
    count: string;
    name: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class RunnerService {
  constructor(private http: HttpClient) {}

  find(runnerId: string): Observable<RunnerInfo> {
    return this.http.get<RunnerInfo>(
      `${environment.backendUrl}/runners/${runnerId}`
    );
  }

  findAll(): Observable<Runner[]> {
    return this.http.get<Runner[]>(`${environment.backendUrl}/runners`);
  }

  getWatchList(runnerId: string): Observable<WatchList[]> {
    return this.http.get<WatchList[]>(
      `${environment.backendUrl}/runners/${runnerId}/watchlist`
    );
  }
}
