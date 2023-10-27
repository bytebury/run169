import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, of, startWith, map } from 'rxjs';
import { Town } from 'src/app/services/town.service';

@Component({
  standalone: true,
  selector: 'app-town-typeahead',
  templateUrl: './town-typeahead.component.html',
  styleUrls: ['./town-typeahead.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TownTypeaheadComponent implements OnInit, OnChanges {
  @Input() label = 'Town Name';
  @Input() towns: Town[] = [];
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) controlName!: string;

  @Output() optionSelected = new EventEmitter<Town>();

  filteredOptions: Observable<{ name: string; id: number }[]> = of([]);

  ngOnInit(): void {
    this.filteredOptions = this.form.get(this.controlName)!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.towns.slice();
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['towns'].currentValue.length > 0) {
      this.form.get(this.controlName)!.setValue('');
    }
  }

  displayFn(town: Town): string {
    return town?.name ? town.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.towns.filter((town: Town) =>
      town.name.toLowerCase().includes(filterValue)
    );
  }

  emitOptionSelected(): void {
    this.optionSelected.emit(this.form.get(this.controlName)!.value);
  }
}
