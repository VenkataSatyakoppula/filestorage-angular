import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalSubject = new Subject<{message:string,show:boolean}>();
  modal$ = this.modalSubject.asObservable();
  curFile: File | undefined; 

  show(fileName:string) {
    this.modalSubject.next({message:fileName,show:true});
  }
  setFile(file:File){
    this.curFile = file
  }
  hide(fileName:string) {
    this.modalSubject.next({message:fileName,show:false});
  }
}
