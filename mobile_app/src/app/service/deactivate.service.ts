import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface IDeactivatableComponent {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DeactivateService implements CanDeactivate<IDeactivatableComponent> {
  canDeactivate(component: IDeactivatableComponent, route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return (component) ? component.canDeactivate() : true;
  }
}
