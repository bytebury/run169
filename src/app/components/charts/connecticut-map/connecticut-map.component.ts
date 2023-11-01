import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

@Component({
  selector: 'app-connecticut-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./connecticut-map.component.html`,
  styleUrls: ['./connecticut-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnecticutMapComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) private mapContainer!: ElementRef;

  @Input() completedTowns: { town_name: string }[] = [];

  private svg: any;
  private g: any;
  private projection: any;
  private townData: any; // GeoJSON data

  ngAfterViewInit() {
    this.initializeMap();
  }

  private initializeMap() {
    // Set up the map container
    const width = this.mapContainer.nativeElement.offsetWidth; // Adjust as needed
    const height = this.mapContainer.nativeElement.offsetHeight; // Adjust as needed

    this.svg = d3
      .select(this.mapContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    this.g = this.svg.append('g');

    this.projection = d3
      .geoAlbers()
      .center([0, 41.6])
      .rotate([72.7, 0])
      .scale(width < 400 ? 11000 : 14800)
      .translate([width / 2, height / 2]);

    // Set up a path generator
    const path = d3.geoPath().projection(this.projection);
    const completedTowns = this.completedTowns.map((town) => town.town_name);

    const tooltip = d3
      .select(this.mapContainer.nativeElement)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // Load your GeoJSON data (replace 'connecticut_towns.geojson' with your file path)
    d3.json('./assets/connecticut_towns.json').then((data) => {
      this.townData = data;

      // Draw the town shapes and set colors based on the "completed" property
      this.g
        .selectAll('path')
        .data(this.townData.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', (feature: any) => {
          return completedTowns.includes(feature.properties.name)
            ? 'blue'
            : 'white';
        })
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('fill-opacity', 0.7)
        .on('mouseover', (event: any, feature: any) => {
          // Show the tooltip on hover
          tooltip.transition().duration(200).style('opacity', 1);
          tooltip
            .html(feature.properties.name)
            .style('left', event.pageX - 60 + 'px')
            .style('top', event.pageY - 350 + 'px')
            .style('font-weight', 'bold');
        })
        .on('mouseout', () => {
          // Hide the tooltip on mouseout
          tooltip.transition().duration(500).style('opacity', 0);
        });
    });
  }
}
