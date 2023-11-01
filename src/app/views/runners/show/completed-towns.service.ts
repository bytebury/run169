import { Injectable } from '@angular/core';
import { BehaviorSubject, defer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompletedTownsService {
  private completedTowns = new BehaviorSubject<{ town_name: string }[]>([]);

  completedTowns$ = defer(() => this.completedTowns.asObservable());

  constructor() {}

  setCompletedTowns(towns: { town_name: string }[]): void {
    this.completedTowns.next(towns);
  }
}
