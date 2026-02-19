import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Employee } from './models/employee';
import { EmployeeService } from './services/employee.service';
import { CartService } from './services/cart.service';
import { HeaderComponent } from "./components/header/header.component";
import { KeycloakService } from 'keycloak-angular';
import { KeycloakEventLegacy, KeycloakEventTypeLegacy } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'IntegratedWeb';
  emps: Employee[] = [];

  constructor(
    private empService: EmployeeService,
    private cartService: CartService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    // ✅ Listen to Keycloak events
    this.keycloakService.keycloakEvents$.subscribe((event: KeycloakEventLegacy) => {
      if (event.type === KeycloakEventTypeLegacy.OnTokenExpired) {
        // Access token expired — try to silently refresh it
        this.keycloakService.updateToken(20).then((refreshed) => {
          if (refreshed) {
            console.log('Token silently refreshed.');
          }
        }).catch(() => {
          // Silent refresh failed — SSO session is dead
          console.warn('Session expired. Saving URL and redirecting to login.');
          localStorage.setItem('redirectUrl', window.location.pathname);
          this.keycloakService.login({
            redirectUri: window.location.origin + '/landing'
          });
        });
      }
    });
  }
}