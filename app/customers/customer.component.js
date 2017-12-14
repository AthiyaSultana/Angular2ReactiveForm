"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
// import { NgForm } from '@angular/forms';
var forms_1 = require('@angular/forms');
require('rxjs/add/operator/debounceTime');
var customer_1 = require('./customer');
function emailMatcher(c) {
    // console.log('abstract control', c);
    var emailControl = c.get('email');
    var confirmEmailControl = c.get('confirmemail');
    if (emailControl.pristine || confirmEmailControl.pristine) {
        return null;
    }
    if (emailControl.value === confirmEmailControl.value) {
        return null;
    }
    return { 'match': true };
}
function ratingRange(min, max) {
    return function (c) {
        if (c.value !== undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return { range: true };
        }
        return null;
    };
}
var CustomerComponent = (function () {
    function CustomerComponent(fb) {
        this.fb = fb;
        this.customer = new customer_1.Customer();
        this.validationMessages = {
            required: 'Please enter your email address',
            pattern: 'Please enter valid email address'
        };
    }
    Object.defineProperty(CustomerComponent.prototype, "addresses", {
        get: function () {
            return this.customerForm.get('addresses');
        },
        enumerable: true,
        configurable: true
    });
    CustomerComponent.prototype.populateTestData = function () {
        this.customerForm.setValue({
            firstName: 'Athiya',
            lastName: 'Sultana',
            email: 'athiya@mailinator.com',
            sendCatalog: true
        });
    };
    CustomerComponent.prototype.save = function () {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm));
    };
    CustomerComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Root form group
        this.customerForm = this.fb.group({
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(50)]],
            // Nested Form Group
            emailGroup: this.fb.group({
                email: ['', [forms_1.Validators.required, forms_1.Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+')]],
                confirmemail: ['', forms_1.Validators.required],
            }, { validator: emailMatcher }),
            phone: '',
            notification: 'email',
            // confirmEmail: ['' , Validators.required],
            rating: ['', ratingRange(1, 5)],
            sendCatalog: true,
            addresses: this.fb.array([this.buildAddress()])
        });
        this.customerForm.get('notification').valueChanges.subscribe(function (value) { return _this.setNotification(value); });
        var emailControl = this.customerForm.get('emailGroup.email');
        // console.log('email control', emailControl);
        // valueChanges watcher
        emailControl.valueChanges.debounceTime(2000).subscribe(function (value) { return _this.setMessage(emailControl); });
        /* this.customerForm = new FormGroup({
             firstName: new FormControl(),
             lastName: new FormControl(),
             email: new FormControl(),
             sendCatalog: new FormControl(true)
         });*/
    };
    CustomerComponent.prototype.addAddresses = function () {
        this.addresses.push(this.buildAddress());
    };
    CustomerComponent.prototype.buildAddress = function () {
        return this.fb.group({
            addressType: '',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: ''
        });
    };
    CustomerComponent.prototype.setMessage = function (c) {
        var _this = this;
        this.emailMessages = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.emailMessages = Object.keys(c.errors).map(function (key) { return _this.validationMessages[key]; }).join(' ');
            console.log('email Messages', this.emailMessages);
        }
    };
    ;
    CustomerComponent.prototype.setNotification = function (notifyVia) {
        var phoneControl = this.customerForm.get('phone');
        // console.log('phoneControl', phoneControl);
        if (notifyVia === 'text') {
            phoneControl.setValidators(forms_1.Validators.required);
        }
        else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();
    };
    CustomerComponent = __decorate([
        core_1.Component({
            selector: 'my-signup',
            templateUrl: './app/customers/customer.component.html'
        }), 
        __metadata('design:paramtypes', [forms_1.FormBuilder])
    ], CustomerComponent);
    return CustomerComponent;
}());
exports.CustomerComponent = CustomerComponent;
//# sourceMappingURL=customer.component.js.map