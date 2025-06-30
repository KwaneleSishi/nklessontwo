import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

interface UserData {
  email: string;
  name: string;
  surname:string;
  // Include other fields if necessary
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  users$: Observable<any[]> | undefined;

  constructor(private firestore: AngularFirestore) {}

  async ngOnInit(){
    
    // Fetch users from Firestore
    this.users$ = this.firestore.collection('users').valueChanges();
  }
}

