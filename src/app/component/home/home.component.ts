import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { User } from 'src/app/interfaces';
import { DataService } from 'src/app/service/data.service';
import { MatTableModule } from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { NgIf } from '@angular/common';

const materialComponents = [
  MatTableModule,
  MatFormField,
  MatLabel,
  MatInputModule,
  MatProgressSpinnerModule,
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, ...materialComponents],
  providers: [CdkColumnDef],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  users = signal<User[] | undefined>(undefined);
  filteredUsers = signal<User[] | undefined>(undefined);
  loading = signal<boolean>(false);
  destroy$ = new Subject<void>();
  userFilter$ = new BehaviorSubject<string>('');

  displayedColumns: string[] = ['name', 'email', 'phone'];

  constructor(private readonly _dataService: DataService) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.setUserFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchUsers() {
    this.loading.set(true);
    this._dataService
      .getAllUsers()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => {
          return of([]);
        })
      )
      .subscribe((data) => {
        this.loading.set(false);
        this.users.set(data);
        this.filteredUsers.set(data);
      });
  }

  setUserFilter() {
    this.userFilter$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        map((query) => {
          return query
            ? this.users()?.filter((user) =>
                user.name.toLowerCase().includes(query)
              )
            : this.users();
        })
      )
      .subscribe((filtered) => {
        this.filteredUsers.set(filtered);
      });
  }
}
