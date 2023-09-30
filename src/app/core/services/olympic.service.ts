import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { olympicCountryType } from "../models/Olympic";

@Injectable({
  providedIn: "root",
})
export class OlympicService {
  private olympicUrl = "/assets/mock/olympic.json";
  private olympics$ = new BehaviorSubject<olympicCountryType[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<any[]> {
    return this.http.get<any[]>(this.olympicUrl).pipe(
      retry(1), // Tentez la requête une fois en cas d'échec
      catchError(this.handleError) // Gérez les erreurs avec la méthode handleError
    );
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client (par exemple, une erreur réseau)
      errorMessage = `Une erreur s'est produite : ${error.error.message}`;
    } else {
      // Erreur côté serveur (par exemple, un code HTTP d'erreur)
      errorMessage = `Code d'erreur : ${error.status}, Message : ${error.message}`;
    }
    // Retournez une observable avec l'erreur
    return throwError(errorMessage);
  }

  // la méthode getCountryDataById dans ce service permet de récupérer et définir l'url du pays selectionné
  getCountryDataById(id: number): Observable<olympicCountryType> {
    const countryUrl = `${this.olympicUrl}/${id}`; // Assurez-vous que l'URL est correcte
    return this.http.get<olympicCountryType>(countryUrl);
  }
}
