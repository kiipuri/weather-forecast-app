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
import { ActivatedRoute, RouterModule } from "@angular/router";
import {
  NgbDropdownModule,
  NgbDatepickerModule,
  NgbDateAdapter,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { switchMap } from "rxjs";

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
    RouterModule,
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class ForecastsComponent {
  constructor(
    private http: HttpClient,
    @Inject("BASE_URL") baseUrl: string,
    private route: ActivatedRoute
  ) {
    this.baseUrl = baseUrl;

    this.route.paramMap.subscribe(params => {
      const city = params.get("city");
      this.route.queryParams.subscribe(params => {
        this.dateStart = params["dateStart"];
        this.dateEnd = params["dateEnd"];
        if (params["dateStart"] && params["dateEnd"] && city) {
          this.getForecastsByDateAndLocation(city);
        } else if (params["dateStart"] && params["dateEnd"]) {
          this.getForecastsByDate();
        } else if (city) {
          this.getForecastsByLocation(city);
        } else {
          this.getForecasts();
        }
      });
    });
  }

  baseUrl = "";
  forecasts: Weather[] = [];
  locations: Location[] = [];
  location: Location = new Location();
  searchField: string = "";
  searchResults: Location[] = [];
  dateStart: string = "";
  dateEnd: string = "";
  data: ChartData<"bar"> = {
    datasets: [],
  };

  getForecasts() {
    this.http.get<Weather[]>(this.baseUrl + "weather").subscribe({
      next: res => {
        this.forecasts = res;
        this.updateChart();
      },
    });
  }

  getForecastsByDateAndLocation(city: string) {
    this.http
      .get<Weather[]>(
        `${this.baseUrl}weather/Location/${city}?dateStart=${this.dateStart}&dateEnd=${this.dateEnd}`
      )
      .subscribe({
        next: res => {
          this.forecasts = res;
          this.updateChart();
        },
      });
  }

  getForecastsByLocation(city: string) {
    this.http
      .get<Weather[]>(`${this.baseUrl}weather/Location/${city}`)
      .subscribe({
        next: res => {
          this.forecasts = res;
          this.updateChart();
        },
      });
  }

  getForecastsByDate() {
    this.http
      .get<Weather[]>(`${this.baseUrl}weather/Location`, {
        params: {
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
        },
      })
      .subscribe({
        next: res => {
          this.forecasts = res;
          this.updateChart();
        },
      });
  }

  updateChart() {
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
  }

  setFilterLocation(location: Location) {
    this.location = location;
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

  getResults() {
    if (this.searchField.length < 3) {
      this.searchResults = [];
      return;
    }

    this.http
      .get<Location[]>(`${this.baseUrl}location/${this.searchField}`)
      .subscribe({
        next: res => {
          this.searchResults = res;
        },
      });
  }
}
