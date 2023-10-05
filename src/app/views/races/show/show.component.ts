import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs';
import { RaceResult } from 'src/app/services/race-result.service';
import { Race, RaceService } from 'src/app/services/race.service';

@Component({
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  readonly displayColumns = [
    'place',
    'bib',
    'total-time',
    'runner',
    'sex',
    'mile-pace',
    'kilometer-pace',
  ];

  race: Race | null = null;
  results = signal<RaceResult[]>([]);

  constructor(
    private raceService: RaceService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const raceId = paramMap.get('id') ?? '';

      this.raceService
        .find(raceId)
        .pipe(
          mergeMap((race) => {
            this.race = race;
            return this.raceService.findResultsByRace(race.id);
          })
        )
        .subscribe({
          next: (results) => {
            this.results.set(results);
          },
          error: (error) => {
            console.log(error);
          },
        });
    });
  }
}
