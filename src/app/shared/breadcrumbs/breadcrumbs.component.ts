import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo: string;
  public bread$: Subscription;

  constructor(private router: Router) {
    this.bread$ = this.getDataRoute()
    .subscribe( ({titulo}) => {
      this.titulo = titulo
      document.title = `AdminPro - ${titulo}`;
    });;
   }

   getDataRoute(){
    return this.router.events
    .pipe(
      filter( event => event instanceof ActivationEnd),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
      map( (event: ActivationEnd) => event.snapshot.data),
    );
   }

   ngOnDestroy() {
    this.bread$.unsubscribe();
   }

}
