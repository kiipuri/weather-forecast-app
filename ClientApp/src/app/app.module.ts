import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { ModifyDataComponent } from "./modify-data/modify-data.component";
import { ForecastsComponent } from "./forecasts/forecasts.component";

@NgModule({
  declarations: [AppComponent, NavMenuComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: "modify-data",
        component: ModifyDataComponent,
      },
      {
        path: "",
        component: ForecastsComponent,
      },
      {
        path: ":city",
        component: ForecastsComponent,
      },
      {
        path: "**",
        redirectTo: "/",
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
