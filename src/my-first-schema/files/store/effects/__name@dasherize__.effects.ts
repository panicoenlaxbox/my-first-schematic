import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as from<%=classify(name) %> from '../actions/<%=dasherize(name) %>.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { <%=classify(name) %>Service } from '../../services/<%=dasherize(name) %>.service';
import { HttpErrorResponse } from '@angular/common/http';
import { <%=classify(name) %>Response } from '../../models/<%=dasherize(name) %>/<%=dasherize(name) %>-response.model';

@Injectable()
export class <%=classify(name) %>Effects {
    constructor(private actions$: Actions, private <%=camelize(name) %>Service: <%=classify(name) %>Service) {
    }

    @Effect()
    load$ = this.actions$.ofType(from<%=classify(name) %>.LOAD_<%=name.toUpperCase() %>).pipe(
        switchMap((action: from<%=classify(name) %>.Load<%=classify(name) %>Action) => {
            return this.<%=camelize(name) %>Service.get(action.payload.first, action.payload.rows).pipe(
                map((response: <%=classify(name) %>Response) => {
                    return new from<%=classify(name) %>.Load<%=classify(name) %>SuccessAction(response);
                }),
                catchError((error: HttpErrorResponse) => {
                    return of(new from<%=classify(name) %>.Load<%=classify(name) %>FailAction(error));
                })
            );
        })
    );
}
