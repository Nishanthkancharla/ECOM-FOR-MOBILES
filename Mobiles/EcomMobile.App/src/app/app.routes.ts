import { Routes } from '@angular/router';
import { MobilesComponent } from './mobiles/mobiles.component';
import { CartComponent } from './cart/cart.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { DealsComponent } from './deals/deals.component';
import { AccessoriesComponent } from './accessories/accessories.component';

export const routes: Routes = [
  { path: '', component: MobilesComponent },
  { path: 'mobiles', component: MobilesComponent },
  { path: 'cart', component: CartComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent },
  { path: 'deals', component: DealsComponent },
  { path: 'accessories', component: AccessoriesComponent }
];
