import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})

export class StorageService {
  
  constructor(
    private authService: MsalService,
    private router: Router,
  ) {

  }

  addToken(token: string): void {
    localStorage.setItem('finitex_t', JSON.stringify(token));
  }

  getUserLocal(): string {
    return JSON.parse(localStorage.getItem('finitex_t'));
  }

  addUser(user: string): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): string {
    return JSON.parse(localStorage.getItem('user'));
  }

  addLanguage(lang: string): void {
    localStorage.setItem('language', JSON.stringify(lang));
  }

  getLanguage(): string {
    return JSON.parse(localStorage.getItem('language'));
  }

  addUserType(type: number): void {
    localStorage.setItem('user_type', JSON.stringify(type));
  }

  getUserType(): string {
    return JSON.parse(localStorage.getItem('user_type'));
  }

  addGrup(data: any): void {
    localStorage.setItem('grupos', JSON.stringify(data));
  }

  getGrup(): any {
    return JSON.parse(localStorage.getItem('grupos'));
  }

  getGrupId(): any {
    return JSON.parse(localStorage.getItem('grupos'));
  }

  addArtwork(data: any): void {
    localStorage.setItem('artwork', JSON.stringify(data));
  }

  getArtwork(): any {
    return JSON.parse(localStorage.getItem('artwork'));
  }

  addProfiles(data: any): void {
    localStorage.setItem('profiles', JSON.stringify(data));
  }

  getProfiles(): any {
    return JSON.parse(localStorage.getItem('profiles'));
  }

  clearStorage(): void {
    localStorage.clear();
  }

  clearStorageSession(): void {
    sessionStorage.clear();
  }

  logoutUser(): void {
    this.clearStorage();
    this.clearStorageSession();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  logoutUserInterceptor(): void {
    this.clearStorageSession();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  addProductBrand(data: any): void {
    localStorage.setItem('productBrand', JSON.stringify(data));
  }

  getProductBrand(): any {
    return JSON.parse(localStorage.getItem('productBrand'));
  }

  addItemToBrandProductShoppingCart(data: any): void {
    localStorage.setItem('brandProductShoppingCart', JSON.stringify(data));
  }

  getItemFromBrandProductShoppingCart(): any {
    let brandProductShoppingCart = JSON.parse(localStorage.getItem('brandProductShoppingCart'));
    return brandProductShoppingCart ? brandProductShoppingCart : [];
  }

  removeBrandProductShoppingCart(): void {
    localStorage.removeItem('brandProductShoppingCart');
  }

  getSelectedSampleItem(): any{
    return JSON.parse(localStorage.getItem('SelectedSampleItem'));
  }

  getSamplesItems(): any{
    return JSON.parse(localStorage.getItem('SamplesItems'));
  }

  removeSamplesItems(): void{
    localStorage.removeItem('SamplesItems');
  }

  addFloorControl(data: any): void {
    localStorage.setItem('floorControl', JSON.stringify(data));
  }

  getFloorControl(): any {
    return JSON.parse(localStorage.getItem('floorControl'));
  }

  refreshToken(newToken: any): void{
    let currentUserAplication: any = this.getUser();
    this.addToken(newToken.access_token);
    currentUserAplication.access_token = newToken.access_token;
    currentUserAplication.expires_in = newToken.expires_in;
    currentUserAplication.refresh_token = newToken.refresh_token;
    this.addUser(currentUserAplication);
  }
}
