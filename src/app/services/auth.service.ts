import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {}

  async logout(): Promise<void> {
    console.log('Logout called, current path:', window.location.pathname);
    localStorage.setItem('redirectUrl', window.location.pathname);

    console.log('Saved to localStorage:', localStorage.getItem('redirectUrl'));
    await this.keycloakService.logout(window.location.origin + '/landing/'); //Was earlier simply, await this.keycloakService.logout(window.location.origin)
  }

  async loadUserProfile(): Promise<any> {
    return this.keycloakService.loadUserProfile();
  }

  //get username
  getUsername(): string | null {
    const profile = this.keycloakService.getKeycloakInstance().profile;
    return profile ? profile.username || profile.firstName || null : null;
  }

  //get user roles
  getUserRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }
}