import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductComponent } from './pages/product/product.component';

import { KeycloakGuard } from './auth/keycloak.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/landing', pathMatch: 'full' },
    {path: 'landing', component: LandingComponent, canActivate: [KeycloakGuard]},
    {path: 'checkout', component: CheckoutComponent, canActivate: [KeycloakGuard]},
    {path:'products',component: ProductComponent, canActivate: [KeycloakGuard]},
    {path: '**', redirectTo: ''}
];
