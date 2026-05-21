import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users = new BehaviorSubject<any[]>([]);

  users$ = this.users.asObservable();

  addUser(user: any) {

    const currentUsers = this.users.value;

    this.users.next([
      ...currentUsers,
      user
    ]);

  }
}