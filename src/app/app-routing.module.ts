import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { CountryComponent } from "./country/country.component";

const routes: Routes = [
  {
    path: "chart/:id",
    component: CountryComponent,
  },
  {
    path: "",
    component: PieChartComponent,
  },
  {
    path: "**", // wildcard
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
