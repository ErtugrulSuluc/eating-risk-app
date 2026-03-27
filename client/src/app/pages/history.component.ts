import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  entries: Entry[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getEntries().subscribe({
      next: (data) => {
        this.entries = [...data].reverse().slice(0, 7);
      }
    });
  }

  barWidth(score: number): string {
    const width = Math.min(score, 12) / 12 * 100;
    return `${width}%`;
  }
}
