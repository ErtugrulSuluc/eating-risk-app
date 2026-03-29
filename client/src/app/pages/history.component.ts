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
  domainLabels: Record<string, string> = {
    cognitiveControl: 'Bilissel Kontrol',
    affective: 'Duygusal Yeme',
    salience: 'Uyaran Hassasiyeti',
    bodyImage: 'Beden Algisi',
    habit: 'Aliskanlik Durtusu'
  };

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

  domainBarWidth(score: number): string {
    return `${Math.min((score / 3) * 100, 100)}%`;
  }

  get domainAverages(): Array<{ key: string; label: string; avg: number }> {
    if (!this.entries.length) return [];

    const totals: Record<string, number> = {
      cognitiveControl: 0,
      affective: 0,
      salience: 0,
      bodyImage: 0,
      habit: 0
    };

    let count = 0;

    for (const entry of this.entries) {
      if (!entry.xaiDomainScores) continue;
      totals['cognitiveControl'] += entry.xaiDomainScores.cognitiveControl || 0;
      totals['affective'] += entry.xaiDomainScores.affective || 0;
      totals['salience'] += entry.xaiDomainScores.salience || 0;
      totals['bodyImage'] += entry.xaiDomainScores.bodyImage || 0;
      totals['habit'] += entry.xaiDomainScores.habit || 0;
      count += 1;
    }

    if (!count) return [];

    return Object.entries(totals)
      .map(([key, value]) => ({
        key,
        label: this.domainLabels[key] || key,
        avg: Number((value / count).toFixed(2))
      }))
      .sort((a, b) => b.avg - a.avg);
  }

  get risingDomainText(): string {
    if (this.entries.length < 2) return 'Yukselis analizi icin en az 2 kayit gerekli.';

    const chronological = [...this.entries].reverse();
    const first = chronological[0].xaiDomainScores;
    const last = chronological[chronological.length - 1].xaiDomainScores;
    if (!first || !last) return 'Alan bazli veri henuz olusmadi.';

    const deltas = [
      { key: 'cognitiveControl', delta: (last.cognitiveControl || 0) - (first.cognitiveControl || 0) },
      { key: 'affective', delta: (last.affective || 0) - (first.affective || 0) },
      { key: 'salience', delta: (last.salience || 0) - (first.salience || 0) },
      { key: 'bodyImage', delta: (last.bodyImage || 0) - (first.bodyImage || 0) },
      { key: 'habit', delta: (last.habit || 0) - (first.habit || 0) }
    ].sort((a, b) => b.delta - a.delta);

    const top = deltas[0];
    if (top.delta <= 0) return 'Son 7 gunde belirgin bir alan artisi yok.';
    return `Son 7 gunde en cok yukselen alan: ${this.domainLabels[top.key]} (+${top.delta}).`;
  }
}
