export class Weather {
  id: number = 0;
  temperature: number = 0;
  rain: number = 0;
  wind: number = 0;
  date: string = "";
  locationId: number = 0;
  location: Location = new Location();
}

export class Location {
  id: number = 0;
  city: string = "";
}
