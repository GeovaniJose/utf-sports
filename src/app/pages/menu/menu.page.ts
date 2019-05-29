import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public esporte = false;

  constructor(
    public usuario: UsuarioService,
    public events: Events
  ) {
    this.events.subscribe('share-sport', sport => {
      this.esporte = sport;
    });
  }

  ngOnInit() {
    this.esporte = false;
  }

}
