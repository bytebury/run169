import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Town {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class TownService {
  /** All of the towns in CT */
  towns = signal<Town[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Load towns from the cache if possible, so that we don't need to call
   * the backend, since CT towns never update. If the user doesn't have the
   * data yet, then we will call the backend and cache it.
   */
  loadTowns(): void {
    const cachedTowns = null; //localStorage.getItem('ct_towns');

    if (cachedTowns) {
      this.towns.set(JSON.parse(cachedTowns));
    } else {
      this.cacheTownsFromBackend();
    }
  }

  /**
   * Calls the backend to get the 169 towns of CT and then caches the response
   */
  private cacheTownsFromBackend(): void {
    this.http
      .get<Town[]>(`${environment.backendUrl}/towns`, { observe: 'body' })
      .pipe(take(1))
      .subscribe({
        next: (towns: Town[]) => {
          localStorage.setItem('ct_towns', JSON.stringify(towns));
          this.towns.set(towns);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
