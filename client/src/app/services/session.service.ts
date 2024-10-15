import { Injectable } from "@angular/core";
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})

export class SessionService {
    private sessionIdKey = 'sessionId';

    getSessionId(): string {
      let sessionId = localStorage.getItem(this.sessionIdKey);
      if (!sessionId) {
        sessionId = this.generateSessionId();
        localStorage.setItem(this.sessionIdKey, sessionId);
      }
      return sessionId;
    }
  
    private generateSessionId(): string {
      return uuidv4();
    }
  
    clearSessionId(): void {
      localStorage.removeItem(this.sessionIdKey);
    }
}
