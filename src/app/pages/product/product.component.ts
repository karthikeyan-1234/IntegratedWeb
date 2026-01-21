import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from "@angular/material/input";
import { FormsModule } from '@angular/forms';
import swal from 'sweetalert2'

@Component({
  selector: 'app-product',
  imports: [CommonModule, MatTableModule, MatIconModule, MatInput, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  products: Product[] = [];
  dataSource!: MatTableDataSource<Product>;
  displayCols: string[] = ["id","name","price","description","actions"];
  editedId: number = 0;


  constructor(private productService: ProductService){
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;

      this.dataSource = new MatTableDataSource<Product>(products);
    },error => {

      console.log("Printing error:")


      console.log(error.error)

      swal.fire({
        title:error.error.title,
        text: error.error.detail
      })

    })
  }

  editProduct(element: Product){
    console.log(element);
    this.editedId = element.id;
  }

    saveProduct(element: Product){
    console.log(element);
    this.editedId = -1;
  }

  deleteProduct(element:Product){
    swal.fire({
      title: 'Do you want to delete ' + element.name + '?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(element).subscribe(res => {
        swal.fire("Deleted..!!","Product deleted..!")
      },err => {
        swal.fire({
          title: "Delete failed..!",
          text: "Unable to delete product"
        })
      })
      }
    })    
  }

  cancelEdit(){
    this.editedId = -1;
  }

}
