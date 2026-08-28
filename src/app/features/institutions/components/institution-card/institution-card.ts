import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { Institution } from '../../models/institution';

@Component({
  selector: 'app-institution-card',
  imports: [NgOptimizedImage],
  templateUrl: './institution-card.html',
})
export class InstitutionCard {
  readonly institution = input.required<Institution>();
}
