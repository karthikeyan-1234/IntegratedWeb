import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

export const routes: Routes = [
    {path: '', component: LandingComponent},
    {path: 'checkout', component: CheckoutComponent},
    {path: '**', redirectTo: ''}
];
