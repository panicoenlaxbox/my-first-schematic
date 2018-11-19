import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { <%=classify(name) %>Response } from '../../models/<%=dasherize(name) %>/<%=dasherize(name) %>-response.model';
import { <%=classify(name) %>Request } from '../../models/<%=dasherize(name) %>/<%=dasherize(name) %>-request.model';

export const LOAD_<%=name.toUpperCase() %> = '[<%=classify(name) %>] Load';
export const LOAD_<%=name.toUpperCase() %>_SUCCESS = '[<%=classify(name) %>] Success';
export const LOAD_<%=name.toUpperCase() %>_FAIL = '[<%=classify(name) %>] Fail';

export class Load<%=classify(name) %>Action implements Action {
    readonly type = LOAD_<%=name.toUpperCase() %>;
    constructor(public payload: <%=classify(name) %>Request) { }
}

export class Load<%=classify(name) %>SuccessAction implements Action {
    readonly type = LOAD_<%=name.toUpperCase() %>_SUCCESS;
    constructor(public payload: <%=classify(name) %>Response) { }
}

export class Load<%=classify(name) %>FailAction implements Action {
    readonly type = LOAD_<%=name.toUpperCase() %>_FAIL;
    constructor(public payload: HttpErrorResponse) { }
}

export type <%=classify(name) %>Actions = Load<%=classify(name) %>Action | Load<%=classify(name) %>SuccessAction | Load<%=classify(name) %>FailAction;
