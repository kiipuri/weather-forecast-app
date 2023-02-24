import { Injectable } from "@angular/core";
import { NgbDateAdapter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class CustomDateAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = "-";

  fromModel(value: string | null): NgbDateStruct | null {
    if (!value) return null;
    const date = value.split(this.DELIMITER);
    return {
      year: +date[0],
      month: +date[1],
      day: +date[2],
    };
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date
      ? date.year +
          "-" +
          ("0" + date.month).slice(-2) +
          "-" +
          ("0" + date.day).slice(-2)
      : null;
  }
}

@Injectable()
export class CustomDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (!value) return null;
    const date = value.split("-");
    return {
      year: +date[0],
      month: +date[1],
      day: +date[2],
    } as NgbDateStruct;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.year +
          "-" +
          ("0" + date.month).slice(-2) +
          "-" +
          ("0" + date.day).slice(-2)
      : "";
    // return date ? `${date.year}-${date.month}-${date.day}` : "";
  }
}
