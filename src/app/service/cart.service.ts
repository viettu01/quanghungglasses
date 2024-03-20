import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TokenService} from "./token.service";
import {CartDto} from "../dto/cart.dto";
import {Environment} from "../environment/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiCartUrl = `${Environment.apiBaseUrl}/cart`;
  private cartItemsSubject = new BehaviorSubject<CartDto[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private tokenService: TokenService, private http: HttpClient) {
    // Load cart items from localStorage on service initialization
    this.loadCartItems();
  }

  private loadCartItems() {
    const items = localStorage.getItem('carts');
    if (items) {
      this.cartItemsSubject.next(JSON.parse(items));
    }
  }

  private saveCartItems(items: CartDto[]) {
    localStorage.setItem('carts', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  addToCartLocalStorage(cartItem: CartDto) {
    let currentItems = this.cartItemsSubject.value;
    // Kiem tra xem san pham da co trong gio hang chua, neu co thi tang so luong len 1
    let existingItem = currentItems.find(item => item.productDetailsId === cartItem.productDetailsId);
    if (existingItem) {
      existingItem.quantity += cartItem.quantity;
    } else {
      currentItems.push(cartItem);
    }
    // currentItems.push(cartItem);
    this.saveCartItems(currentItems);
  }

  getCartItemsServer() {
    this.http.get(`${this.apiCartUrl}`).subscribe({
      next: (response: any) => {
        this.cartItemsSubject.next(response.cartDetails);
      }
    });
  }

  getListItemCartOnServer() {
    return this.http.get(`${this.apiCartUrl}`);
  }

  getListItemCartOnLocalStorage() {
    return this.cartItemsSubject.value;
  }

  addToCartServer(cartItem: CartDto) {
    this.http.post(`${this.apiCartUrl}/add-product-to-cart`, cartItem).subscribe({
      next: (response: any) => {
        this.cartItemsSubject.next(response.cartDetails);
      }
    });
  }

  updateProductQuantity(cartItem: CartDto) {
    this.http.put(`${this.apiCartUrl}/update-product-quantity`, cartItem).subscribe({
      next: (response: any) => {
        this.cartItemsSubject.next(response.cartDetails);
      }
    });
  }

  plusQuantityOnServer(cartItemId: number) {
    this.http.put(`${this.apiCartUrl}/plus-product-quantity/${cartItemId}`, null).subscribe({
      next: (response: any) => {
        this.cartItemsSubject.next(response.cartDetails);
      }
    });
  }

  plusQuantityOnLocalStorage(cartItemId: number) {
    let currentItems = this.cartItemsSubject.value;
    let existingItem = currentItems.find(item => item.id === cartItemId);
    if (existingItem) {
      existingItem.quantity++;
    }
    this.saveCartItems(currentItems);
  }

  minusQuantityOnServer(cartItemId: number) {
    this.http.put(`${this.apiCartUrl}/minus-product-quantity/${cartItemId}`, null).subscribe({
      next: (response: any) => {
        this.cartItemsSubject.next(response.cartDetails);
      }
    });
  }

  minusQuantityOnLocalStorage(cartItemId: number) {
    let currentItems = this.cartItemsSubject.value;
    let existingItem = currentItems.find(item => item.id === cartItemId);
    if (existingItem) {
      existingItem.quantity--;
    }
    this.saveCartItems(currentItems);
  }

  deleteCartItemOnServer(cartItemId: number) {
    return this.http.delete(`${this.apiCartUrl}/delete-cart-details/${cartItemId}`);
  }

  deleteCartItemOnLocalStorage(cartItemId: number) {
    let currentItems = this.cartItemsSubject.value;
    let index = currentItems.findIndex(item => item.id === cartItemId);
    if (index !== -1) {
      currentItems.splice(index, 1);
    }
    this.saveCartItems(currentItems);
  }
}
