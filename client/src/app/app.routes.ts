import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { WebshopComponent } from './pages/webshop/webshop.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { BasketComponent } from './pages/basket/basket.component';
import { AccountComponent } from './pages/account/account.component';

export const routes: Routes = [
    { path: '', redirectTo: '/webshop', pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    { path: 'webshop', component: WebshopComponent },
    { path: 'webshop/:id', component: ProductDetailsComponent },
    { path: 'basket', component: BasketComponent },
    { path: 'account', component: AccountComponent},
];
