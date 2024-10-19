import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";
import { v4 as uuidv4 } from 'uuid';
import { CookieService } from 'ngx-cookie-service';
import { Basket } from "../interfaces/basket.interface";

@Injectable({
    providedIn: 'root'
})

export class SessionService {
    private sessionIdKey = 'sessionId';
    private apiUrl = 'http://localhost:5200';

    constructor(
      private httpClient: HttpClient, 
      private cookieService: CookieService
    ) {}

    async getSessionId(): Promise<string> {
      let sessionId = this.cookieService.get(this.sessionIdKey);
      if (!sessionId) {
        sessionId = this.generateSessionId();
        this.cookieService.set(this.sessionIdKey, sessionId, 1); // Expires in 1 day
        try {
          await this.createEmptyBasket(sessionId);
          console.log('Create empty basket was triggered, with sessionId:', sessionId);
        } catch (error) {
          console.error('Error creating empty basket:', error);
        }
      }
      return sessionId;
    }
  
    private generateSessionId(): string {
      return uuidv4();
    }
  
    clearSessionId(): void {
      this.cookieService.delete(this.sessionIdKey);
    }

    private async createEmptyBasket(userId: string): Promise<any> {
      /*
      try {
        const newBasket: Basket = { userId, items: [] };
        const response = await firstValueFrom(this.httpClient.post(`${this.apiUrl}/baskets`, newBasket , { withCredentials: true, responseType: 'text'}));
        console.log('Response from create basket:', response);
        return response;
      } catch (error) {
        console.error('Error in createEmptyBasket:', error);
        if (error instanceof HttpErrorResponse) {
          console.error('Status:', error.status);
          console.error('Error body:', error.error);
        }
        throw error;
      }
        */
    }
}
