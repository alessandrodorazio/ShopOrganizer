// Servizio per la gestione dello stato dell'app tramite sessionStorage

import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService implements OnInit {
  dirty = false;

  ngOnInit() {
    window.sessionStorage.clear();
  }

  constructor() { }

  add(name: string, obj: any) {
    window.sessionStorage.setItem(name, obj);
    this.dirty = true;
  }

  get(name: string): any {
    return window.sessionStorage.getItem(name);
  }

  remove(name: string) {
    window.sessionStorage.removeItem(name);
    this.dirty = true;
  }

  clear() {
    if (window.sessionStorage.length > 0) {
      window.sessionStorage.clear();
      this.dirty = true;
    }
  }

  length() {
    return window.sessionStorage.length;
  }

  markAsSaved() {
    this.dirty = false;
  }

  isDirty() {
    return this.dirty;
  }
}
