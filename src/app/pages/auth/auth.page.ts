import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { user } from 'src/app/models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})

export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  colorsubmit='primary';
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  constructor() {}

  ngOnInit() {}

  async onSubmit() {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();
      const button = document.getElementById('btnsubmit');
      // Start the animation
      //button.classList.add('animate-button');
      this.colorsubmit='secondary';
      button.innerHTML = '<strong>V  A  L  I  D  A  N  D  O </strong><ion-icon size="large" color="tertiary" (click)="changeIcon()" slot="start" name="information-circle-outline"></ion-icon>';
      setTimeout(() => {
        button.innerHTML = '<strong>V  A  L  I  D  A  N  D  O </strong><ion-icon size="large" color="tertiary" (click)="changeIcon()" slot="start" name="airplane-outline"></ion-icon>';
      }, 500); // 500ms delay
      // Delay the submission process
      setTimeout(() => {
        // Submission logic goes here
        this.firebaseSvc
        .singIn(this.form.value as user)
        .then((res) => {
          button.innerHTML = '<strong>V  A  L  I  D  A  N  D  O </strong><ion-icon size="large" color="tertiary" (click)="changeIcon()" slot="start" name="lock-open-outline"></ion-icon>';
          this.getUserInfo(res.user.uid);
        })
        .catch((error) => {
          this.utilSvc.presentToast({
            message: error.message,
            duration: 2500,
            color: 'warning',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          this.form.reset();
          loading.dismiss();
        });
        // Remove the animation class after completion
        button.classList.remove('animate-button');
      }, 1000); // 500ms delay
    }
  }

  async getUserInfo(uid: string) {
    if (this.form.valid) {

      const loading = await this.utilSvc.loading();
      await loading.present();

      const button = document.getElementById('btnsubmit');
      // Start the animation
      button.classList.add('animate-button');
      let path =  `users/${uid}`;
      this.firebaseSvc
        .getDocument(path as string)
        .then((user: user) => {
          this.utilSvc.saveInLocalStorage('User', JSON.stringify(user));
          this.colorsubmit='secondary';
          button.innerHTML = '<strong>V  A  L  I  D  A  N  D  O  </strong><ion-icon size="large" color="tertiary" (click)="changeIcon()" slot="start" name="checkmark-done-outline"></ion-icon>';
          setTimeout(() => {
            this.utilSvc.routerLink('main/home');
            this.form.reset();
            this.utilSvc.presentToast({
              message:  `TE DAMOS LA BIENVENIDA ${user.name}`,
              duration: 5000,
              color: 'success',
              position: 'middle',
              icon: 'person-circle-outline',
            });
          }, 1500); // 500ms delay
        })
        .catch((error) => {
          this.utilSvc.presentToast({
            message: error.message,
            duration: 5000,
            color: 'warning',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
          this.colorsubmit='primary';
          button.innerHTML = '<strong>I N G R E S A R</strong><ion-icon (click)="changeIcon()" slot="start" name="log-in-outline"></ion-icon>';
        })
        .finally(() => {
          loading.dismiss();
          setTimeout(() => {
          this.colorsubmit='primary';
          button.innerHTML = '<strong>I N G R E S A R</strong><ion-icon (click)="changeIcon()" slot="end" name="log-in-outline"></ion-icon>';
          }, 1500); // 500ms delay
        });
    }
  }

  changeIcon() {

  }

}
