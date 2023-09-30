import { Component, OnInit, ElementRef } from "@angular/core";
import { Chart, registerables } from "../../../node_modules/chart.js/auto";
import { OlympicService } from "../core/services/olympic.service"; // Importez le service
import { olympicCountryType } from "../core/models/Olympic"; // Assurez-vous d'importer la bonne interface
import { Router, ActivatedRoute } from "@angular/router";

Chart.register(...registerables);

@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.scss"],
})
export class PieChartComponent implements OnInit {
  olympicData: olympicCountryType[] = []; // Initialisez avec un tableau vide
  maxParticipations: olympicCountryType | undefined;

  constructor(
    private olympicService: OlympicService,
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Utilisez la méthode du service pour charger les données
    this.olympicService.loadInitialData().subscribe((data) => {
      this.olympicData = data;
      this.showMaxParticipations();
      this.RenderChart(); // Une fois les données chargées, appelez la méthode pour rendre le graphique
      console.log(data);
    });
  }

  showMaxParticipations() {
    if (this.olympicData.length === 0) {
      return; // Aucune donnée disponible
    }

    // Utilisez reduce pour trouver le pays avec le plus de participations
    this.maxParticipations = this.olympicData.reduce(
      (previous, current) =>
        current.participations.length > previous.participations.length
          ? current
          : previous,
      this.olympicData[0]
    );
  }
  RenderChart() {
    // Utilisez les données dans la configuration du graphique
    const chartOn = Chart.getChart("piechart"); // Récupérer le graphique existant s'il y en a un

    if (chartOn) {
      // Si un graphique existe déjà avec le même ID de canevas, détruisez-le
      chartOn.destroy();
    }

    // Extrait les médailles et les noms des pays
    const medalCounts = this.olympicData.map((country) =>
      country.participations.reduce(
        (total, participation) => total + participation.medalsCount,
        0
      )
    );
    const onSliceClick = (event: [], chart: any) => {
      const elements = chart.getElementsAtEventForMode(
        event,
        "nearest",
        { intersect: true },
        false
      );

      if (elements.length > 0) {
        const clickedElement = elements[0];
        const dataIndex = clickedElement.index;
        const countryData = this.olympicData[dataIndex]; // Obtenir l'objet olympicCountryType correspondant
        const countryId = countryData.id; // Récupérer l'ID du pays

        // Redirigez vers la page 'chart' avec le paramètre 'countryId'
        this.router.navigate(["chart", countryId], {
          relativeTo: this.route,
        });
      }
    };
    const countryNames = this.olympicData.map((country) => country.country);

    // Créez un tableau d'objets de données avec les propriétés label et data
    const chartData = {
      labels: countryNames,
      offset: 3000,

      datasets: [
        {
          data: medalCounts,
          backgroundColor: [
            "#b8cbe7",
            "#bfe0f1",
            "#9780a1",
            "#89a1db",
            "#793d52",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const myChart = new Chart("piechart", {
      type: "pie",
      data: chartData,
      options: {
        plugins: {
          tooltip: {
            position: "average",
            callbacks: {
              label: (tooltipItem: any) => {
                const dataIndex = tooltipItem.dataIndex;
                const value = medalCounts[dataIndex];
                return `🥇 ${value} `;
              },
            },
          },
          legend: {
            display: true,
          },
        },
        scales: {},
        responsive: true,
        onClick: (event: any) => {
          onSliceClick(event, myChart);
        },
      },
    });
  }
}
