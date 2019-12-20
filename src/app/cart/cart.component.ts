import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { subtract } from 'ngx-bootstrap/chronos/public_api';

export interface ICart {
  id: number;
  image: string;
  description: string;
  price: number;
  quantity: number;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  bikes: Array<ICart> = [];
  name = '';

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    const carts = JSON.parse(localStorage.getItem('carts'));
    if (carts && carts.length > 0) {
      this.bikes = carts;
    } else {
      this.bikes = await this.loadFromJson();
    }
  }

  async loadFromJson() {
    const carts = await this.http.get('assets/inventory.json').toPromise();
    return carts.json();
  }

  addBikeModel(bike: string) {
    switch (bike) {
      case 'model1':
        this.bikes.unshift({
          'id': 1,
          'image': '../../assets/bike1.jpeg',
          'description': 'Bike Model 1',
          'price': 5000,
          'quantity': 1
        });
        break;
      case 'model2':
        this.bikes.unshift({
          'id': 2,
          'image': '../../assets/bike2.jpeg',
          'description': 'Bike Model 2',
          'price': 4000,
          'quantity': 1
        });
        break;
      case 'model3':
        this.bikes.unshift({
          'id': 3,
          'image': '../../assets/bike3.jpeg',
          'description': 'Bike Model 3',
          'price': 3000,
          'quantity': 1
        });
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('carts', JSON.stringify(this.bikes));
  }

  remove(index: number) {
    this.bikes.splice(index, 1);
    this.saveToLocalStorage();
  }

  calculate() {
    const total = this.bikes.reduce((inc, item, i, arc) => {
      inc += item.price * item.quantity;
      return inc;
    }, 0);
    const taxAmount = total * .1;
    const subTotal = total - taxAmount;

    const commaIndex = this.name.indexOf(', ');
    const firstName = this.name.slice(commaIndex + 1, this.name.length);
    const lastName = this.name.slice(0, commaIndex);
    const fullName = firstName + ' ' + lastName;

    return {
      name: fullName,
      tax: taxAmount,
      subTotal: subTotal,
      total: total
    };
  }

  checkout() {
    const commaIndex = this.name.indexOf(', ');
    let error = false;

    if (this.name === '') {
      this.toastService.showToast('warning', 5000, 'Name must not be null');
      error = true;
    } else if (commaIndex === -1) {
      this.toastService.showToast('warning', 5000, 'Name must contain a comma and a space');
      error = true;
    }
    if (!error) {
      const data = this.calculate();
      this.router.navigate(['invoice', data]);
    }
  }
}
