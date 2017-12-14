import {Component, OnInit} from '@angular/core';
// import { NgForm } from '@angular/forms';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import {Customer} from './customer';

function emailMatcher(c: AbstractControl) {
    // console.log('abstract control', c);
    let emailControl = c.get('email');
    let confirmEmailControl = c.get('confirmemail');
    if (emailControl.pristine || confirmEmailControl.pristine) {
        return null;
    }
    if (emailControl.value === confirmEmailControl.value) {
        return null;
    }
    return {'match': true};
}

function ratingRange(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        if (c.value !== undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return {range: true};
        }
        return null;
    };
}

@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit {
    customerForm: FormGroup;
    customer: Customer = new Customer();
    emailMessages: string;
    private validationMessages = {
        required: 'Please enter your email address',
        pattern: 'Please enter valid email address'
    }
    
    constructor(private fb: FormBuilder) {
    }
    
    get addresses(): FormArray {
        return <FormArray>this.customerForm.get('addresses');
    }
    
    populateTestData(): void {
        this.customerForm.setValue({
            firstName: 'Athiya',
            lastName: 'Sultana',
            email: 'athiya@mailinator.com',
            sendCatalog: true
        });
    }
    
    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm));
    }
    
    ngOnInit() {
        // Root form group
        this.customerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.maxLength(50)]],
            // Nested Form Group
            emailGroup: this.fb.group({
                email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
                confirmemail: ['', Validators.required],
            }, {validator: emailMatcher}),
            phone: '',
            notification: 'email',
            // confirmEmail: ['' , Validators.required],
            rating: ['', ratingRange(1, 5)],
            sendCatalog: true,
            addresses: this.fb.array([this.buildAddress()])
        });
        this.customerForm.get('notification').valueChanges.subscribe(value => this.setNotification(value));
        const emailControl = this.customerForm.get('emailGroup.email');
        // console.log('email control', emailControl);
        // valueChanges watcher
        emailControl.valueChanges.debounceTime(2000).subscribe(value => this.setMessage(emailControl));
        /* this.customerForm = new FormGroup({
             firstName: new FormControl(),
             lastName: new FormControl(),
             email: new FormControl(),
             sendCatalog: new FormControl(true)
         });*/
    }
    addAddresses(): void {
        this.addresses.push(this.buildAddress());
    }
    buildAddress(): FormGroup {
        return this.fb.group({
            addressType: '',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: ''
        });
    }
    setMessage(c: AbstractControl): void {
        this.emailMessages = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.emailMessages = Object.keys(c.errors).map(key => this.validationMessages[key]).join(' ');
            console.log('email Messages', this.emailMessages);
        }
    };
    setNotification(notifyVia: string): void {
        const phoneControl = this.customerForm.get('phone');
        // console.log('phoneControl', phoneControl);
        if (notifyVia === 'text') {
            phoneControl.setValidators(Validators.required);
        } else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();
    }
}
