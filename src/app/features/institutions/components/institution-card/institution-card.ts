import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Institution } from '../../models/institution';
import { UiHeading } from '../../../../shared/components/ui/ui-heading';

@Component({
  selector: 'app-institution-card',
  imports: [NgOptimizedImage, RouterLink, UiHeading],
  templateUrl: './institution-card.html',
})
export class InstitutionCard {
  readonly institution = input.required<Institution>();
}
