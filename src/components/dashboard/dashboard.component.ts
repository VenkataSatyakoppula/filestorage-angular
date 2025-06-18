import { Component, ElementRef, HostListener, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FileItem } from '../../models/file.model';
import { CommonModule } from '@angular/common';
import { SpeedDailComponent } from '../speed-dail/speed-dail.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,SpeedDailComponent,SideBarComponent,SvgIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  dropdown: boolean = false;
  gridView: boolean = false;
  selectedCount = signal(0);
  files: string[] | null = new Array(20).fill(false);
  checkBoxChecked: boolean[] =new Array(20).fill(false); 
  zeroFiles: boolean = this.files !== null && this.files.length <= 0;

  getFileIcon(ext: string): string {
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'jpg':
      case 'png':
        return '🖼️';
      case 'zip':
        return '🗜️';
      case 'pptx':
        return '📊';
      case 'docx':
        return '📃';
      default:
        return '📁';
    }
  }
  constructor(){  }
  ngOnInit(){
    initFlowbite();
  }
  checkBox(index:string){
    if(this.checkBoxChecked[Number.parseInt(index)]){
      this.selectedCount.update((val)=> {
        if(val > 0){
          return val - 1;
        }
        return 0;
      });
    }else{
      this.selectedCount.update((val)=> val+1);
    }
    this.checkBoxChecked[Number.parseInt(index)] = !this.checkBoxChecked[Number.parseInt(index)];
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const targetDiv = document.getElementById('dropdownDefaultButton');
    if (targetDiv && !targetDiv.contains(event.target as Node)) {
      this.dropdown = false;
    }
  }
}

