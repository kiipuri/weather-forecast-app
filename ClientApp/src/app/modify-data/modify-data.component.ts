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
  NgbModalRef,
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
  styleUrls: ["./modify-data.component.css"],
})
export class ModifyDataComponent {
  closeResult = "";
  baseUrl = "";
  weather: Weather = new Weather();
  forecasts: Weather[] = [];
  locations: Location[] = [];
  newLocation: string = "";
  modalRef: NgbModalRef | null = null;

  edit: boolean = false;
  setAllValues: boolean = false;
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
    this.edit = false;
    this.modalRef = this.modalService.open(content);
  }

  checkEmpty(obj: any): boolean {
    return Object.values(obj).some(o => {
      if (o === null || o === "") {
        return true;
      }

      if (typeof o === "object") {
        return this.checkEmpty(o);
      }

      return false;
    });
  }

  saveForecast() {
    if (this.checkEmpty(this.weather)) {
      this.setAllValues = true;
      return;
    }

    if (this.edit) {
      this.http.put<Weather>(this.baseUrl + "weather", this.weather).subscribe({
        next: () => {
          this.setAllValues = false;
          this.getForecasts();
          this.modalRef?.close();
        },
      });
    } else {
      this.http
        .post<Weather>(this.baseUrl + "weather", this.weather)
        .subscribe({
          next: () => {
            this.setAllValues = false;
            this.getForecasts();
            this.modalRef?.close();
          },
        });
    }
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
    this.weather = weather;
    this.edit = true;
    this.modalRef = this.modalService.open(editmodal);
  }

  deleteForecast() {
    this.http
      .delete<Weather>(this.baseUrl + "weather/Delete/" + this.weather.id)
      .subscribe({
        next: () => {
          this.getForecasts();
          this.modalRef?.close();
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
