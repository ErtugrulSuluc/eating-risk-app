import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Entry } from '../models/entry.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  entries: Entry[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getEntries().subscribe({
      next: (data) => {
        this.entries = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get lastEntry(): Entry | null {
    if (!this.entries.length) return null;
    return this.entries[this.entries.length - 1];
  }

  get trendText(): string {
    if (this.entries.length < 2) return 'Trend icin daha fazla veri gerekli.';

    const prev = this.entries[this.entries.length - 2].riskScore;
    const current = this.entries[this.entries.length - 1].riskScore;

    if (current > prev) return 'Risk artiyor.';
    if (current < prev) return 'Risk dusuyor.';
    return 'Risk sabit.';
  }

  riskClass(level: string): string {
    return `risk ${level.toLowerCase()}`;
  }
}
