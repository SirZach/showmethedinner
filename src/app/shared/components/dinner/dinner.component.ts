import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import {
  Dinner
} from '../../../models';
import {
  FoodService
} from '../../../shared/services';

@Component({
  selector: 'dinner',
  templateUrl: './dinner.component.html',
  styleUrls: ['./dinner.component.scss']
})
export class DinnerComponent implements OnInit {
  @Input() dinner: Dinner;
  @Input() canEdit: boolean = false;
  @Output() onSave = new EventEmitter<Dinner>();
  @Output() onCancel = new EventEmitter<Dinner>();
  @Output() onReplace = new EventEmitter<Dinner>();
  @Output() onDelete = new EventEmitter<Dinner>();

  isEditing: boolean = false;
  cachedDinnerData: any;
  dinnerName = new FormControl('', [Validators.required]);
  dinnerMeals = new FormControl('', [Validators.required]);
  dinnerRecipe = new FormControl('', [Validators.pattern('https?://.+')]);
  dinnerImage = new FormControl('', [Validators.pattern('https?://.+')]);

  constructor(
    private $food: FoodService,
    private el: ElementRef,
    private chgRef: ChangeDetectorRef,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    // if this is a new dinner, go straight into editing mode
    if (!this.dinner.id) {
      this.edit(this.dinner);
      this.chgRef.detectChanges();
      this.el.nativeElement.scrollIntoView({
        block: 'end',
        inline: 'nearest',
        behavior: 'smooth'
      });
    }
  }

  edit(dinner: Dinner) {
    this.isEditing = true;
    this.cachedDinnerData = dinner.toJSON();
  }

  save(dinner: Dinner) {
    if (this.isDinnerValid()) {
      this.$food.saveDinner(dinner)
        .then(() => {
          this.isEditing = false;
          this.snackbar.open('Dinner saved', 'Got It', { duration: 2000 });
          this.onSave.emit(dinner);
        });
    }
  }

  /**
   * Remove dinner from server and UI
   * @param dinner Dinner
   */
  delete(dinner: Dinner) {
    this.$food.deleteDinner(dinner)
      .then(() => {
        this.snackbar.open('Dinner deleted', 'Got It', { duration: 2000 });
        this.onDelete.emit(dinner);
      });
  }

  cancel(dinner: Dinner) {
    this.isEditing = false;
    Object.assign(dinner, this.cachedDinnerData);
    this.onCancel.emit(dinner);
  }

  replace(dinner: Dinner) {
    this.onReplace.emit(dinner);
  }

  isDinnerValid(): boolean {
    return this.dinnerName.valid &&
      this.dinnerMeals.valid &&
      this.dinnerImage.valid &&
      this.dinnerRecipe.valid;
  }
}
