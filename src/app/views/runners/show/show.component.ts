import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RunnerInfo, RunnerService } from 'src/app/services/runner.service';

@Component({
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  runnerInfo: RunnerInfo = {} as RunnerInfo;

  constructor(
    private runner: RunnerService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const runnerId = paramMap.get('runner_id') ?? '';

      this.runner.find(runnerId).subscribe({
        next: (runner) => {
          this.runnerInfo = runner;
        },
        error: (error) => {
          console.error(error);
        },
      });
    });
  }
}
