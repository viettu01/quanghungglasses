import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TokenService} from "./token.service";
import {CartDto} from "../dto/cart.dto";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // private itemCountSubject = new BehaviorSubject<number>(0);
  // itemCount$ = this.itemCountSubject.asObservable();

  private carts = new BehaviorSubject<CartDto[]>([]);
  itemCount$ = this.carts.asObservable();

  constructor(private tokenService: TokenService) {
  }

  addToCart(id: number, quantity: number) {
    // const currentCount = this.itemCountSubject.getValue();
    // this.itemCountSubject.next(currentCount + 1);
    const currentCart = this.carts.getValue();
    // this.carts.next([...currentCart, new CartDto(id, quantity)]);
    if (!this.tokenService.isLogin()) {
      localStorage.setItem('cart', JSON.stringify(this.carts.getValue()));
    }
  }
}
