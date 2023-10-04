import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, startWith, map, of, take } from 'rxjs';
import { Runner, RunnerService } from 'src/app/services/runner.service';

@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  myControl = new FormControl<string | Runner>('');
  runners: Runner[] = [];
  filteredRunners: Observable<Runner[]> = of([]);

  constructor(private runnerService: RunnerService, private router: Router) {}

  ngOnInit() {
    this.loadRunners();

    this.filteredRunners = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        if (typeof value === 'string') {
          return value ? this._filter(value) : this.runners.slice();
        }
        return value
          ? this._filter(`${value.first_name} ${value.last_name}`)
          : this.runners.slice();
      })
    );
  }

  goToProfile(runnerId: string): void {
    this.router.navigate(['runners', runnerId]);
  }

  onSubmit(): void {
    this.goToProfile((this.myControl.getRawValue() as Runner).runner_id);
  }

  displayFn(runner: Runner): string {
    return runner ? `${runner.first_name} ${runner.last_name}` : '';
  }

  private _filter(name: string): Runner[] {
    const filterValue = name.toLowerCase();

    return this.runners.filter(({ first_name, last_name }) => {
      const fullName = `${first_name} ${last_name}`;
      return fullName.toLowerCase().includes(filterValue);
    });
  }

  private loadRunners(): void {
    this.runnerService
      .findAll()
      .pipe(take(1))
      .subscribe({
        next: (runners) => {
          this.runners = runners;
          this.myControl.setValue('');
        },
        error: (error) => console.error(error),
      });
  }
}
