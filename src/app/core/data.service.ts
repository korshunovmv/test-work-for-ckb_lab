// import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Observer } from 'rxjs/Observer';

// import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Issue } from '../model/issue.model';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataService  {
  rootApiUrl: string; 
  
  constructor(
    private http: HttpClient,
  ) {
    this.rootApiUrl = environment.rootApiUrl;
  }

  /** GET issues from the server */
  getIssues (): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.rootApiUrl}/issues`)
      .pipe(
        tap(issues => this.log(`fetched issues`)),
        catchError(this.handleError('getIssues', []))
      );
  }

  // /** GET issue by id. Return `undefined` when id not found */
  // getIssueNo404<Data>(id: number): Observable<Issue> {
  //   const url = `${this.rootApiUrl}/issues/?id=${id}`;
  //   return this.http.get<Issue[]>(url)
  //     .pipe(
  //       map(issues => issues[0]), // returns a {0|1} element array
  //       tap(h => {
  //         const outcome = h ? `fetched` : `did not find`;
  //         this.log(`${outcome} issue id=${id}`);
  //       }),
  //       catchError(this.handleError<Issue>(`getIssue id=${id}`))
  //     );
  // }
  
  //////// Save methods //////////

  /** POST: add a new issue to the server */
  addIssue (issue: Issue): Observable<Issue> {
    return this.http.post<Issue>(`${this.rootApiUrl}/issues`, issue, httpOptions).pipe(
      tap((issue: Issue) => this.log(`added issue w/ id=${issue.id}`)),
      catchError(this.handleError<Issue>('addIssue'))
    );
  }

  /** DELETE: delete the issue from the server */
  deleteIssue (issue: Issue | string): Observable<Issue> {
    const id = typeof issue === 'string' ? issue : issue.id;
    const url = `${this.rootApiUrl}/issues/${id}`;

    return this.http.delete<Issue>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted issue id=${id}`)),
      catchError(this.handleError<Issue>('deleteIssue'))
    );
  }

  /** PUT: update the issue on the server */
  updateIssue (issue: Issue): Observable<any> {
    return this.http.put(`${this.rootApiUrl}/issues`, issue, httpOptions).pipe(
      tap(_ => this.log(`updated issue id=${issue.id}`)),
      catchError(this.handleError<any>('updateIssue'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for issue consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a DataService message with the MessageService */
  private log(message: string) {
    // this.messageService.add('DataService: ' + message);
    console.log('DataService: ' + message);
  }
}