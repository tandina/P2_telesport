import { Component, OnInit } from "@angular/core";
import { Chart, registerables } from "chart.js/auto";
import { OlympicService } from "../core/services/olympic.service";
import { olympicCountryType } from "../core/models/Olympic";
import { Router, ActivatedRoute } from "@angular/router";

Chart.register(...registerables);

@Component({
  selector: "app-country",
  templateUrl: "./country.component.html",
  styleUrls: ["./country.component.scss"],
})
export class CountryComponent implements OnInit {
  olympicData: olympicCountryType[] = [];
  maxParticipations: olympicCountryType | undefined;
  country: olympicCountryType | undefined;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Utilisez la méthode du service pour charger toutes les données
    this.olympicService.loadInitialData().subscribe((data) => {
      this.olympicData = data;
      this.route.paramMap.subscribe((params) => {
        const id = params.get("id");
        console.log(id);

        if (id) {
          // Utilisez la méthode pour trouver le pays correspondant à l'ID
          this.country = this.findCountryById(+id);
          if (!this.country) {
            // Redirigez vers la page d'erreur si le pays n'est pas trouvé
            this.router.navigate(["/**"]);
            return;
          }
          this.RenderChart();
          console.log(this.country);
        } else {
          this.country = undefined;
        }
      });
    });
  }
  findCountryById(id: number): olympicCountryType | undefined {
    return this.olympicData.find((country) => country.id === id);
  }
  getTotalMedals(): number {
    if (this.country) {
      return this.country.participations.reduce(
        (total, participation) => total + participation.medalsCount,
        0
      );
    } else {
      return 0; // Ou une autre valeur par défaut si le pays est indéfini
    }
  }
  getTotalAthletes(): number {
    if (this.country) {
      return this.country.participations.reduce(
        (total, participation) => total + participation.athleteCount,
        0
      );
    } else {
      return 0;
    }
  }
  RenderChart() {
    // Utilisez les données du pays pour générer le graphique
    if (this.country) {
      // Extrait les années et les médailles pour le pays spécifique
      const years = this.country.participations.map(
        (participation) => participation.year
      );
      const medalCounts = this.country.participations.map(
        (participation) => participation.medalsCount
      );
      const athleteCounts = this.country.participations.map(
        (participation) => participation.athleteCount
      );

      const myChart = new Chart("linechart", {
        type: "line",
        data: {
          labels: years.map((year) => year.toString()),
          datasets: [
            {
              label: "Médailles",
              data: medalCounts,
              borderColor: "#FF5733",
              fill: false,
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              position: "average",
              callbacks: {
                label: (tooltipItem: any) => {
                  const value = tooltipItem.formattedValue;
                  const yearIndex = tooltipItem.dataIndex; // Indice de l'année actuelle
                  const athletes = athleteCounts[yearIndex];
                  return `🥇 ${value}  \n Athletes : ${athletes}`;
                },
              },
              bodyFont: {
                size: 25, // Taille de la police du corps du tooltip
              },
            },
            legend: {
              display: true,
            },
          },
          scales: {},
          responsive: true,
        },
      });
    }
  }
}
