import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

import { AutenticacaoGuard } from '../../guards/autenticacao.guard';

const routes: Routes = [
  { path: '', component: MenuPage,
    children: [{
      path: 'home',
      loadChildren: '../home/home.module#HomePageModule',
      canActivate: [AutenticacaoGuard]
    }, {
      path: 'sport',
      loadChildren: '../sport/sport.module#SportPageModule'
    }, {
      path: 'players',
      loadChildren: '../players/players.module#PlayersPageModule'
    }, {
      path: 'profile',
      loadChildren: '../profile/profile.module#ProfilePageModule'
    }, {
      path: 'notifications',
      loadChildren: '../notifications/notifications.module#NotificationsPageModule'
    }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
