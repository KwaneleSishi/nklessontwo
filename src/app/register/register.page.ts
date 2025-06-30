import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  image: File | null = null;
  imageUrl: string | null = null;

  constructor(
          private afAuth: AngularFireAuth,
          private afStorage: AngularFireStorage,
          private firestore: AngularFirestore ,
          private router: Router
        ) { }

  ngOnInit() {
  }
 
  async register() {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      
      const userId = userCredential.user?.uid;

      if (userId) {
        if (this.image) {
          const filePath = `user_images/${uuidv4()}`;
          const fileRef = this.afStorage.ref(filePath);
          const task = this.afStorage.upload(filePath, this.image);
          
          task.snapshotChanges().pipe(
            finalize(() => fileRef.getDownloadURL().subscribe((url: string | null) => {
              this.imageUrl = url;
              this.saveUserData(userId);
            }))
          ).subscribe();
        } else {
          this.saveUserData(userId);
        }
      }

    } catch (error) {
      console.error('Error registering user:', error);
    }

  }
  private async saveUserData(userId: string) {
    try {
      await this.firestore.collection('users').doc(userId).set({
        name: this.name,
        surname: this.surname,
        email: this.email,
        password: this.password, 
        imageUrl: this.imageUrl || null
      });
      console.log('User data saved successfully');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  onFileSelected(event: any) {
    this.image = event.target.files[0];
  }
}






