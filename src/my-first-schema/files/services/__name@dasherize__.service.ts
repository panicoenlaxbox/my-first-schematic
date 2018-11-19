import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { <%=classify(name) %> } from '../models/<%=dasherize(name) %>/<%=dasherize(name) %>.model';
import { <%=classify(name) %>Response } from '../models/<%=dasherize(name) %>/<%=dasherize(name) %>-response.model';
import { ApiBaseService } from './api-base.service';

@Injectable({
    providedIn: 'root'
})
export class <%=classify(name) %>Service extends ApiBaseService<<%=classify(name) %>Response, <%=classify(name) %>> {
    constructor(http: HttpClient) {
        super(http, '<%=dasherize(name) %>.json');
    }
}
