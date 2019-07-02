import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { FirebaseService } from './../../services/firebase.service';
import { UsuarioService } from './../../services/usuario.service';
import { ToastService } from './../../services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public sports = [];
  public mySports = [];
  public userId = '';
  public userAtletic = '';
  public userNome = '';
  public userTel = '';
  public userPhotoURL = '';
  public userEsportes = '';
  public showLoading = true;

  constructor(
    public firebase: FirebaseService,
    public usuario: UsuarioService,
    public alert: AlertController,
    public toast: ToastService
  ) {
    this.usuario.getUserData().subscribe(user => {
      this.userId = user.id;
      this.userAtletic = user.atletica;
      this.userNome = user.nome;
      this.userTel = user.telefone;
      this.userPhotoURL = user.photoURL;
      this.userEsportes = user.esportes;
      this.chargeSports();
    });
  }

  ngOnInit() {
  }

  async subscribeSport(idSport) {
    const subscribeAlert = await this.alert.create({
      header: 'Inscrever-se no Esporte',
      inputs: [
        {
          type: 'text',
          name: 'posicao',
          placeholder: 'Informe sua posição de origem...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Okay',
          handler: async (input) => {
            if (input.posicao.length >= 3) {
              const player = {
                nome: this.userNome,
                telefone: this.userTel,
                posicao: input.posicao,
                photoURL: this.userPhotoURL,
                presenca: 0
              };

              await this.firebase.db().collection('sports')
                .doc(idSport)
                .collection('players')
                .doc(this.userId)
                .set({
                  ...player
                });

              await this.firebase.db().collection('users')
                .doc(this.userId)
                .set({
                  esportes: `${this.userEsportes} ${idSport}`
                }, {merge: true});

              this.chargeSports();

              this.toast.presentToast('Você foi cadastrado no esporte com sucesso!');
            } else {
              this.toast.presentToast('Insira uma posição com no mínimo 3 letras!');
            }
          }
        }
      ]
    });

    await subscribeAlert.present();
  }

  async chargeSports() {
    await this.firebase.db().collection('sports')
      .where('atletica', '==', this.userAtletic)
      .onSnapshot(results => {
        this.sports = [];
        this.mySports = [];

        results.docs.forEach(doc => {
          if (this.userEsportes.indexOf(doc.id) !== -1) {
            this.mySports.push({ id: doc.id, ...doc.data() });
          } else {
            this.sports.push({ id: doc.id, ...doc.data() });
          }
        });

        this.showLoading = false;
      });
  }

}
