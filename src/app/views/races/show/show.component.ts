import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Race, RaceService } from 'src/app/services/race.service';

@Component({
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  race: Race | null = null;

  constructor(
    private raceService: RaceService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const raceId = paramMap.get('id') ?? '';

      this.raceService.find(raceId).subscribe({
        next: (race) => {
          this.race = race;
        },
        error: (error) => {
          console.error(error);
        },
      });
    });
  }
}
