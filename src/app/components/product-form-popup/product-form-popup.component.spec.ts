import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormPopupComponent } from './product-form-popup.component';

describe('ProductFormPopupComponent', () => {
  let component: ProductFormPopupComponent;
  let fixture: ComponentFixture<ProductFormPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFormPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
