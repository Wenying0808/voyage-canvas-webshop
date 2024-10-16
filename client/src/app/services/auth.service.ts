import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, throwError } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { User } from "../interfaces/user.interface";
import { BasketService } from './basket.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private apiUrl = 'http://localhost:5200'; 
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor(
        private http: HttpClient,
        private basketService: BasketService,
    ) {
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
            }),
            catchError( error => {
                console.error('Logout failed', error);
                this.currentUserSubject.next(null);
                return throwError(() => error);
            })
        ).subscribe();
    }

    getCurrentUser(): Observable<User | null> {
        return this.http.get<User>(`${this.apiUrl}/api/current-user`, { withCredentials: true }).pipe(
          tap(user => {
            this.currentUserSubject.next(user);
          }),
          switchMap(user => this.ensureBasketExists(user))
        );
    }

    private ensureBasketExists(user: User | null ): Observable<User | null> {
        // check if user exists
        if (!user) return of(null);

        return this.basketService.getBasket(user._id).pipe(
            catchError(() => {
                // if user doesn't have a basket
                return this.basketService.createBasket(user._id);
            }),
            switchMap(() => of(user))
        )
    }
    
    get isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }
}