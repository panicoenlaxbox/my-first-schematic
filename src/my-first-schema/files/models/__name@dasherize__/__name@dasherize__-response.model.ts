import { <%=classify(name) %> } from './<%=dasherize(name) %>.model';
import { ResponseBase } from '../response-base';

export interface <%=classify(name) %>Response extends ResponseBase<<%=classify(name) %>> {
}
