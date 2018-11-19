import * as from<%=classify(name) %> from '../actions/<%=dasherize(name) %>.actions';
import { <%=classify(name) %> } from '../../models/<%=dasherize(name) %>/<%=dasherize(name) %>.model';

export interface State {
    data: <%=classify(name) %>[];
    first: number;
    rows: number;
    totalRecords: number;
    loading: boolean;
    loaded: boolean;
    error: any;
}

const initialState: State = {
    data: [],
    first: 0,
    rows: 0,
    totalRecords: 0,
    loading: false,
    loaded: false,
    error: null
};

export function <%=camelize(name) %>Reducer(state = initialState, action: from<%=classify(name) %>.<%=classify(name) %>Actions): State {
    switch (action.type) {
        case from<%=classify(name) %>.LOAD_<%=name.toUpperCase() %>:
            return {
                data: [],
                totalRecords: 0,
                first: action.payload.first,
                rows: action.payload.rows,
                loading: true,
                loaded: false,
                error: null
            };
        case from<%=classify(name) %>.LOAD_<%=name.toUpperCase() %>_SUCCESS:
            return {
                data: action.payload.data,
                totalRecords: action.payload.totalRecords,
                first: state.first,
                rows: state.rows,
                loading: false,
                loaded: true,
                error: null
            };
        case from<%=classify(name) %>.LOAD_<%=name.toUpperCase() %>_FAIL:
            return {
                data: [],
                totalRecords: 0,
                first: 0,
                rows: 0,
                loading: false,
                loaded: true,
                error: {
                    status: action.payload.status,
                    message: action.payload.message,
                    url: action.payload.url
                }
            };
        default:
            return state;
    }
}
