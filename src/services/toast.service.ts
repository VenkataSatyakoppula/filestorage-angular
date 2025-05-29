import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<{ message: string; type: 'success' | 'error',timeout:number }>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' = 'success',timeout:number = 3000) {
    this.toastSubject.next({ message, type, timeout });
  }
}
