// Servizio per la gestione dello stato dell'app tramite sessionStorage

import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService implements OnInit {
  dirty = false;

  ngOnInit() {
  }

  constructor() { }

  add(name: string, obj: any) {
    window.localStorage.setItem(name, JSON.stringify(obj));
    this.dirty = true;
  }

  get(name: string): any {
    const o: string = window.localStorage.getItem(name);
    return (o != null) ? JSON.parse(o) : null;
  }

  extract(name: string): any {
    const out = this.get(name);
    if (out !== null) {
      this.remove(name);
    }

    return out;
  }

  remove(name: string) {
    window.localStorage.removeItem(name);
    this.dirty = true;
  }

  length() {
    return window.localStorage.length;
  }

  markAsSaved() {
    this.dirty = false;
  }

  isDirty() {
    return this.dirty;
  }
}
