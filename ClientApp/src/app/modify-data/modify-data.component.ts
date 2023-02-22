import { Component, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { NgbDatepickerModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-modify-data-component",
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, CommonModule],
  templateUrl: "./modify-data.component.html",
})
export class ModifyDataComponent {
  closeResult = "";
  baseUrl = "";

  weather: Weather = {
    id: 0,
    temperature: 0,
    rain: 0,
    wind: 0,
    date: new Date(Date.now()).toISOString().split("T")[0],
  };

  forecasts: Weather[] = [];

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.baseUrl = baseUrl;
    this.getForecasts();
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(() => {
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
      });
  }

  getForecasts() {
    this.http.get<Weather[]>(this.baseUrl + "weather").subscribe({
      next: res => {
        this.forecasts = res;
      },
    });
  }
}

interface Weather {
  id: number;
  temperature: number;
  rain: number;
  wind: number;
  date: string;
}
