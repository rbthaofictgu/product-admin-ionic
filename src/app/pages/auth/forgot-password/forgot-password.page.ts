import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { user } from 'src/app/models/user.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  constructor() {}

  ngOnInit() {}

  async onSubmit() {
    if (this.form.valid) {
      const loading = await this.utilSvc.loading();
      await loading.present();

      this.firebaseSvc
        .sendRecoveryEmail(this.form.value.email)
        .then((res) => {
          this.utilSvc.presentToast({
            message: 'If you have an account with us, an email with instructions for changing your password has been sent. Thank you for using our services.',
            duration: 5000,
            color: 'secondary',
            position: 'middle',
            icon: 'send-outline',
          });
          this.utilSvc.routerLink('/auth');
        })
        .catch((error) => {
          this.utilSvc.presentToast({
            message: error.message,
            duration: 5000,
            color: 'warning',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}
