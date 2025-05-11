import { Component, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { FileItem } from '../../models/file.model';
import { CommonModule } from '@angular/common';
import { SpeedDailComponent } from '../speed-dail/speed-dail.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { SvgIconComponent } from 'angular-svg-icon';
import { BlobOptions } from 'node:buffer';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,SpeedDailComponent,SideBarComponent,SvgIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  dropdown: boolean = false;
  gridView: boolean = false;
   
  files: string[] | null = new Array(20).fill(false);
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
  constructor(private eRef: ElementRef
  ){}
  checkBox(index:string){
    console.log( Number.parseInt(index));
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const targetDiv = document.getElementById('dropdownDefaultButton');
    if (targetDiv && !targetDiv.contains(event.target as Node)) {
      this.dropdown = false;
    }
  }
}

