import { Component, inject, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LandingService } from '../../services/landing.service';
import { Product } from '../../models/product.model';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form-popup',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule],
  templateUrl: './product-form-popup.component.html',
  styleUrl: './product-form-popup.component.css'
})
export class ProductFormPopupComponent {

   private fb = inject(FormBuilder); // Type: FormBuilder - for reactive form creation
  private landingService = inject(LandingService); // Type: LandingService - product data management
  private productService = inject(ProductService)
  
  @Output() closeForm = new EventEmitter<void>(); // Event to close the form from parent
  
  productForm: FormGroup; // Type: FormGroup - reactive form for product data
  isSubmitting = false; // Type: boolean - loading state for form submission
  submittedSuccessfully = false; // Type: boolean - success state after submission
  
  // Default image placeholder for new products
  private defaultImage = 'https://via.placeholder.com/300x200?text=New+Product';

  constructor() {
    // Initialize the product form with validation rules
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(0.01), Validators.max(10000)]],
      image: ['', [Validators.required]], // Basic URL validation
      description: ['', [Validators.maxLength(500)]]
    });
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    // Mark all fields as touched to trigger validation display
    this.markFormGroupTouched(this.productForm);
    
    // If form is invalid, stop submission
    if (this.productForm.invalid) {
      return;
    }
    
    this.isSubmitting = true; // Set loading state
    
    // Get form values
    const formValue = this.productForm.value;
    
    // Generate a new product ID (in real app, this would come from backend)
    const currentProducts = this.landingService.getProducts()();
    const newId = currentProducts.length > 0 
      ? Math.max(...currentProducts.map(p => p.id)) + 1 
      : 1;
    
    // Create new product object
    const newProduct: Product = {
      id: newId,
      name: formValue.name.trim(),
      price: parseFloat(formValue.price),
      image: formValue.image?.trim() || this.defaultImage,
      description: formValue.description?.trim() || ''
    };


      // Add product through service
      this.productService.addProduct(newProduct).subscribe(res => {
        this.landingService.addProduct(newProduct);
        // Reset form and show success state
        this.isSubmitting = false;
        this.submittedSuccessfully = true;
      }, err => {
                this.isSubmitting = false;
        this.submittedSuccessfully = false;
      })


  }
/**
   * Resets the form to initial state
   */
  resetForm(): void {
    this.productForm.reset();
    this.submittedSuccessfully = false;
    // Clear validation state
    Object.keys(this.productForm.controls).forEach(key => {
      this.productForm.get(key)?.setErrors(null);
    });
  }

  
  /**
   * Closes the form without submission
   */
  onCancel(): void {
    this.resetForm();
    this.closeForm.emit();
  }

  /**
   * Marks all form controls as touched to trigger validation display
   * @param formGroup - FormGroup: the form group to mark as touched
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

   /**
   * Gets validation error message for a field
   * @param fieldName - string: name of the form field
   * @returns string: appropriate error message
   */
  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }
    
    if (control.hasError('required')) {
      return 'This field is required';
    }
    
    if (control.hasError('minlength')) {
      return `Minimum ${control.errors['minlength'].requiredLength} characters required`;
    }
    
    if (control.hasError('maxlength')) {
      return `Maximum ${control.errors['maxlength'].requiredLength} characters allowed`;
    }
    
    if (control.hasError('min')) {
      return `Minimum value is ${control.errors['min'].min}`;
    }
    
    if (control.hasError('max')) {
      return `Maximum value is ${control.errors['max'].max}`;
    }
    
    // if (control.hasError('pattern')) {
    //   if (fieldName === 'image') {
    //     return 'Please enter a valid URL starting with http:// or https://';
    //   }
    //   return 'Invalid format';
    // }
    
    return 'Invalid value';
  }

   /**
   * Checks if field has validation error
   * @param fieldName - string: name of the form field
   * @returns boolean: true if field has error and is touched
   */
  hasError(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

}
