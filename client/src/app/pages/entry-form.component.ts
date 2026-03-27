import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent {
  resultText = '';
  loading = false;

  form = this.fb.group({
    mealCount: [3, [Validators.required, Validators.min(0), Validators.max(8)]],
    skippedMeal: [false],
    nightEating: [false],
    bingeEating: [false],
    emotionalEating: [false],
    stressLevel: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    mood: ['normal', Validators.required]
  });

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.resultText = '';

    this.apiService.createEntry(this.form.value as any).subscribe({
      next: (entry) => {
        this.loading = false;
        this.resultText = `Bugunku risk: ${entry.riskLevel} (skor: ${entry.riskScore})`;
      },
      error: () => {
        this.loading = false;
        this.resultText = 'Veri kaydedilirken hata olustu.';
      }
    });
  }
}
