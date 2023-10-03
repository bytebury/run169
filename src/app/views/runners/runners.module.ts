import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowComponent } from './show/show.component';
import { RunnersRoutingModule } from './runners-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [ShowComponent],
  imports: [CommonModule, RunnersRoutingModule, MatTabsModule, MatTableModule],
})
export class RunnersModule {}
