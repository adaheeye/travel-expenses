import {Injectable } from '@angular/core';
import {Observable } from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Activity} from "./activity.model";
import {map} from "rxjs/operators";
import {createParams} from "./util/request-uil";

@Injectable()
export class ActivityService {

  private readonly resourceUrl = '/api/v1';


  constructor(private http: HttpClient) {
  }

  public getActivities(): Observable<any> {
    return this.http.get<Activity[]>(`${this.resourceUrl}/activities`);
  }

  public findByParams(_id: string, activityName: string): Observable<Activity> {
    const params = createParams(Object.assign({},
      _id && { _id },
      activityName && { activityName }
      ));
    return this.http.get<Activity>(`${this.resourceUrl}/activity/`, {params}).pipe(map((data: Activity) => {
      return new Activity(data);
    }));
  }

  public findById(id: string): Observable<Activity> {
    return this.http.get<Activity>(`${this.resourceUrl}/activity/${id}`).pipe(map((data: Activity) => {
      return new Activity(data);
    }));
  }

  public create(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(`${this.resourceUrl}/activity`, activity).pipe(map((data: Activity) => {
      return new Activity(data);
    }));
  }

  public createMany(activities: Activity[]): Observable<Activity[]> {
    return this.http.post<Activity[]>(`${this.resourceUrl}/activities`, activities).pipe(map((data: Activity[]) => {
      return data.map((activity) => new Activity(activity));
    }));
  }

  public update(activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.resourceUrl}/activity`, activity).pipe(map((data: Activity) => {
      return new Activity(data);
    }));
  }

  public delete(_id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.resourceUrl}/activity/${_id}`, {observe: 'response'});
  }

  public deleteAll(): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.resourceUrl}/activities`, {observe: 'response'});
  }

  // TODO
  public getSampleActivities() {

  }

}
