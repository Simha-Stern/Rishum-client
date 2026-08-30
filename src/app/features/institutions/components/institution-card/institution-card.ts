import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Institution } from '../../models/institution';

@Component({
  selector: 'app-institution-card',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './institution-card.html',
})
export class InstitutionCard {
  readonly institution = input.required<Institution>();
}
