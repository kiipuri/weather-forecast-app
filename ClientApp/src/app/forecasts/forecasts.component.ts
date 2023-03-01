import { HttpClient } from "@angular/common/http";
import { Component, Inject, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Weather, Location } from "../classes";
import { CommonModule } from "@angular/common";
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration, ChartData, ChartEvent } from "chart.js";
import { CustomDateParserFormatter } from "../date-parser-formatter";
import { CustomDateAdapter } from "../date-parser-formatter";
import { NgChartsModule } from "ng2-charts";
import {
  NgbDropdownModule,
  NgbDatepickerModule,
  NgbDateAdapter,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-forecasts.component",
  templateUrl: "./forecasts.component.html",
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    FormsModule,
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class ForecastsComponent {
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.baseUrl = baseUrl;
    this.getForecasts();
    this.getLocations();
  }

  baseUrl = "";
  forecasts: Weather[] = [];
  locations: Location[] = [];
  location: Location = new Location();
  dateStart: string = "";
  dateEnd: string = "";
  data: ChartData<"bar"> = {
    datasets: [],
  };

  getForecasts() {
    this.http.get<Weather[]>(this.baseUrl + "weather").subscribe({
      next: res => {
        this.forecasts = res;
        this.setFilterByLocation();
      },
    });
  }

  getForecastsByLocation() {
    this.http
      .get<Weather[]>((this.baseUrl = "weather/Location/" + this.location.city))
      .subscribe({
        next: res => {
          this.forecasts = res;
          this.data = {
            datasets: [
              {
                data: this.forecasts.map(f => f.temperature),
                label: "Temperature",
              },
              {
                data: this.forecasts.map(f => f.wind),
                label: "Wind",
              },
              {
                data: this.forecasts.map(f => f.rain),
                label: "Rain",
              },
            ],
            labels: this.forecasts.map(f => `${f.date} ${f.location.city}`),
          };

          this.chart?.update();
        },
      });
  }

  setFilterByLocation() {
    this.data = {
      datasets: [
        {
          data: this.forecasts.map(f => f.temperature),
          label: "Temperature",
        },
        {
          data: this.forecasts.map(f => f.wind),
          label: "Wind",
        },
        {
          data: this.forecasts.map(f => f.rain),
          label: "Rain",
        },
      ],
      labels: this.forecasts.map(f => `${f.date} ${f.location.city}`),
    };

    this.chart?.update();
    // switch (this.filter) {
    //   case "Temperature":
    //     this.data.datasets = [
    //       {
    //         data: this.forecasts.map(f => f.temperature),
    //         label: this.filter,
    //       },
    //     ];
    //     break;
    //
    //   case "Rain":
    //     this.data.datasets = [
    //       {
    //         data: this.forecasts.map(f => f.rain),
    //         label: this.filter,
    //       },
    //     ];
    //     break;
    //
    //   case "Wind":
    //     this.data.datasets = [
    //       {
    //         data: this.forecasts.map(f => f.wind),
    //         label: this.filter,
    //       },
    //     ];
    //     break;
    //
    //   default:
    //     break;
    // }
  }

  setFilterLocation(location: Location) {
    this.location = location;
    this.getForecastsByLocation();
  }

  getLocations() {
    this.http.get<Location[]>(this.baseUrl + "location").subscribe({
      next: res => {
        this.locations = res;
      },
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {},
    },
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    // console.log(event, active);
  }
}
