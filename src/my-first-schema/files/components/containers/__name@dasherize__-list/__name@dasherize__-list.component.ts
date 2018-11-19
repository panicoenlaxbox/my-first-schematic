import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Supplier } from '../../../models/suppliers/supplier.model';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Table } from 'primeng/table';
import { Store } from '@ngrx/store';
import * as fromSuppliers from '../../../store/actions/suppliers.actions';
import { State } from '../../../store/reducers';
import { Subscription } from 'rxjs';
import { SuppliersRequest } from 'src/app/crm/models/suppliers/suppliers-request.model';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.scss']
})
export class SuppliersListComponent implements OnInit, OnDestroy {
  data: Supplier[];
  totalRecords: number;
  loading = true;
  frozenCols: any[];
  scrollableCols: any[];
  sortField: string;
  frozenColWidth = 300;
  onLazyLoadEvent: LazyLoadEvent;

  @ViewChild(Table)
  table: Table;

  filterRowHeight = 50;
  subscription$: Subscription;

  constructor(private store: Store<State>) {

  }

  ngOnInit(): void {
    this.frozenCols = [
      { field: 'id', header: 'Id', filterMatchMode: 'equals' },
      { field: 'name', header: 'Name' }
    ];
    this.scrollableCols = [
      { field: 'company', header: 'Company' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Phone' },
      { field: 'address', header: 'Address' }
    ];
    this.table.sortField = this.frozenCols[0].field;
    this.subscription$ = this.store.select((state: State) => state.crm.suppliers).subscribe(suppliersState => {
      if (!suppliersState.loaded || !this.onLazyLoadEvent) {
        return;
      }
      this.data = suppliersState.data;
      this.totalRecords = suppliersState.totalRecords;
      this.loading = false;
    });
  }

  getFrozenWidth(): string {
    return (this.frozenColWidth * this.frozenCols.length) + 'px';
  }

  rowTrackBy(index: number, item: any) {
    return (<Supplier>item).id;
  }

  onLazyLoad(event: LazyLoadEvent) {
    if (this.data && this.loading) {
      return;
    }

    console.log(event);

    this.loading = true;

    setTimeout(() => {
      this.onLazyLoadEvent = event;
      this.store.dispatch(new fromSuppliers.LoadSuppliersAction(<SuppliersRequest>{
        first: event.first,
        rows: event.rows
      }));
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
