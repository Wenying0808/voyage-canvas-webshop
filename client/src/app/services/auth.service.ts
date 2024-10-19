import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }
      
    login(): void {
        window.location.href = `${this.apiUrl}/auth/google`;
    }
    
    logout(): void {
        this.http.get(`${this.apiUrl}/logout`, { withCredentials: true }).pipe(
            tap(() => {
                console.log('Logout successful');
                this.currentUserSubject.next(null);
            }),
            catchError((error) => {
                console.error('Logout error:', error);
                // Even if the server request fails, we should still clear the local user state
                this.currentUserSubject.next(null);
                return of(null);
              })
        ).subscribe();
    }

    getCurrentUser(): Observable<User | null> {
        return this.http.get<User>(`${this.apiUrl}/api/current-user`, { withCredentials: true }).pipe(
          tap(user => {
            this.currentUserSubject.next(user);
            console.log('User fetched from API:', user);
          }),
          /*
          switchMap(user => this.ensureBasketExists(user)),
          tap(user => {
            console.log('User after ensuring basket exists:', user);
          }),
          catchError(error => {
            console.error('Error in getCurrentUser:', error);
            this.currentUserSubject.next(null);
            return of(null);
          })
            */
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
    
    get isLoggedIn(): Observable<boolean> {
        return this.currentUser.pipe(
          map(user => !!user)
        );
    }
}