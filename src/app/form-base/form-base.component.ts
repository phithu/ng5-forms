import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'pt-form-base',
  templateUrl: './form-base.component.html',
  styleUrls: ['./form-base.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormBaseComponent implements OnInit {

  public form: FormGroup;
  public controlConfig = {
    username: new FormControl('', {
      // validators will be executed required -> minLength
      validators: Validators.compose([Validators.minLength(5), Validators.required]),
      updateOn: 'submit'
    }),
    phone: new FormControl('', {
      // validators will be executed required -> pattern
      validators: Validators.compose([Validators.pattern(/^-?\d+$/), Validators.required]),
      updateOn: 'change'
    }),
    email: new FormControl('', {
      // validators will be executed required -> email
      validators: Validators.compose([Validators.email, Validators.required]),
      updateOn: 'blur' // <- Update when email control onBlur
    })
  };
  public validatorMessages = {
    username: {
      minlength: 'Username is invalid',
      required: 'Username is requied'
    },
    phone: {
      required: 'Phone is requied',
      pattern: 'Phone is invalid'
    },
    email: {
      required: 'Email is requied',
      email: 'Email is invalid',
    }
  };
  public formErrors = {
    username: '',
    email: '',
    phone: '',
  };


  constructor() { }

  ngOnInit() {
    this.form = new FormGroup(this.controlConfig);
    this.form.get('phone').valueChanges.subscribe(() => this.validatorControl('phone'));
  }

  public submitForm(value: any) {
    this.validatorForm(true);
  }

  public validatorControl(field?: string, submited?: boolean) {
    if (!field) {
      return;
    }
    if (this.formErrors.hasOwnProperty(field)) {
      this.formErrors[field] = ''; // <-- clear errors message previous
      const control = this.form.get(field); // <-- Get control by filed name
      if (control && control.invalid) {
        const message = this.validatorMessages[field];
        for (const keyError in control.errors) {
          if (control.errors.hasOwnProperty(keyError)) { // <-- Check the control have had error with keyError
            this.formErrors[field] = message[keyError]; // <-- Set value form formErrors
          }
        }
      }
    }
  }

  public validatorForm(submited?: boolean) {
    if (!this.form) { // <-- The form haven't existed yet
      return;
    }
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        if (submited) {
          this.form.markAsDirty();
        }
        this.validatorControl(field);
      }
    }
  }

}
