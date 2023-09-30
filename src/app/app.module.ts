import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { OlympicService } from "./core/services/olympic.service";
import { CountryComponent } from "./country/country.component";

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    PieChartComponent,
    CountryComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgbModule],
  providers: [OlympicService],
  bootstrap: [AppComponent],
})
export class AppModule {}
