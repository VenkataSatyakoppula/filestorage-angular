import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit {

  message :string | null = null;
  type:string = 'error';
  timeout:number =0;

  constructor(private _toastService: ToastService){
  }

  ngOnInit() {
    this._toastService.toast$.subscribe(({ message, type,timeout }) => {
      this.message = message;
      this.type = type;
      this.timeout = timeout
      setTimeout(() => this.message = null, this.timeout);
    });
  }
  close(){
    this.message = null;
  }

}
