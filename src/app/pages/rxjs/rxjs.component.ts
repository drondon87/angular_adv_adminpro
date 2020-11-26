import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  public intervaSubs: Subscription;

  constructor() {
    /*this.returnObservable()
    .pipe(
      retry(1)
    ).subscribe(
      valor => console.log('Subs: ', valor),
      (err) => console.warn('Error:', err),
      () => console.info('Obs terminado')
    )*/

    this.intervaSubs = this.returnInterval()
      .subscribe( console.log)

   }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.intervaSubs.unsubscribe();
  }

  returnInterval() : Observable<number>{
    return interval(1000)
      .pipe(
        //take(10),
        map( valor => valor +1),
        filter(valor => (valor % 2 === 0) ? true : false ),
      );
  }

  returnObservable(): Observable<number> {
    let i = -1;
    return new Observable<number> ( observer => {
      
      const intervalo = setInterval( () => {
        i++;
        observer.next(i);

        if(i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }

        if(i === 2) {
          observer.error('i llegó al valor de 2');
        }

      }, 1000);
    });
  }

}
