import { Component, Inject, ViewChild } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { CustomDateParserFormatter } from "../date-parser-formatter";
import { CustomDateAdapter } from "../date-parser-formatter";

import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerModule,
  NgbModal,
  NgbDropdownModule,
  NgbAlertModule,
  NgbAlert,
} from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { Weather, Location } from "../classes";

@Component({
  selector: "app-modify-data-component",
  standalone: true,
  imports: [
    NgbDatepickerModule,
    FormsModule,
    CommonModule,
    NgbDropdownModule,
    NgbAlertModule,
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
  templateUrl: "./modify-data.component.html",
})
export class ModifyDataComponent {
  closeResult = "";
  baseUrl = "";
  weather: Weather = new Weather();
  forecasts: Weather[] = [];
  locations: Location[] = [];
  newLocation: string = "";

  cantDelete: boolean = false;
  cantAdd: boolean = false;

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.baseUrl = baseUrl;
    this.getForecasts();
    this.getLocations();
  }

  open(content: any) {
    this.weather = new Weather();
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        () => {
          this.http
            .post<Weather>(this.baseUrl + "weather", this.weather)
            .subscribe({
              next: () => {
                this.getForecasts();
              },
              error: err => {
                console.error(err);
              },
            });
        },
        () => {}
      );
  }

  getForecasts() {
    this.http.get<Weather[]>(this.baseUrl + "weather").subscribe({
      next: res => {
        this.forecasts = res;
      },
    });
  }

  getLocations() {
    this.http.get<Location[]>(this.baseUrl + "location").subscribe({
      next: res => {
        this.locations = res;
      },
    });
  }

  setLocation(location: Location) {
    this.weather.locationId = location.id;
    this.weather.location = location;
  }

  editForecast(weather: Weather, editmodal: any) {
    Object.assign(this.weather, weather);
    this.modalService.open(editmodal).result.then(
      () => {
        this.http
          .put<Weather>(this.baseUrl + "weather", this.weather)
          .subscribe({
            next: () => {
              this.getForecasts();
            },
          });
      },
      () => {}
    );
  }

  deleteForecast(weather: Weather) {
    this.http
      .delete<Weather>(this.baseUrl + "weather/Delete/" + weather.id)
      .subscribe({
        next: () => {
          this.getForecasts();
        },
      });
  }

  deleteLocation(location: Location) {
    this.http
      .delete<Location>(this.baseUrl + "location/Delete/" + location.id)
      .subscribe({
        next: () => {
          this.getLocations();
        },
        error: err => {
          if (err.status === 400) {
            this.cantDelete = true;
          }
        },
      });
  }

  addLocation() {
    if (this.newLocation === "") {
      return;
    }

    const reqHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    this.http
      .post(`${this.baseUrl}location/New/`, JSON.stringify(this.newLocation), {
        headers: reqHeaders,
      })
      .subscribe({
        next: () => {
          this.newLocation = "";
          this.getLocations();
        },
        error: err => {
          if (err.status === 400) {
            this.cantAdd = true;
          }
        },
      });
  }
}
