import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from "./user.interface";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private apiUrl = 'http://localhost:5200'; 
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User | null>(null);
        this.currentUser = this.currentUserSubject.asObservable();
    }
    login(): void {
        window.location.href = `${this.apiUrl}/auth/google`;
    }
    
    logout(): void {
        this.http.get(`${this.apiUrl}/logout`, { withCredentials: true }).pipe(
            tap(() => {
            this.currentUserSubject.next(null);
            })
        ).subscribe();
    }

    getCurrentUser(): Observable<User | null> {
        return this.http.get<User>(`${this.apiUrl}/api/current-user`, { withCredentials: true }).pipe(
          tap(user => {
            this.currentUserSubject.next(user);
          })
        );
    }
    
    get isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }
}