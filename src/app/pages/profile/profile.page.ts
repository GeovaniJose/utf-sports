import { Component, OnInit } from '@angular/core';

import { UsuarioService } from './../../services/usuario.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public user = {};

  constructor(
    public usuario: UsuarioService
  ) {
    this.usuario.getUserData().subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
  }

}
