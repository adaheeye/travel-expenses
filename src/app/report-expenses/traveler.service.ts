import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import {Traveler} from "./traveler.model";
import {createParams} from "./util/request-uil";

@Injectable()
export class TravelerService {

  private readonly resourceUrl = '/api/v1';
  constructor(private http: HttpClient) {
  }

  public getTravelers(): Observable<Traveler[]> {
    return this.http.get<Traveler[]>(`${this.resourceUrl}/travelers`);
  }

  public findByParams(_id: string, firstName: string, lastName: string): Observable<Traveler> {
    const params = createParams(Object.assign({},
      _id && { _id },
      firstName && { firstName },
      lastName && { lastName }
    ));
    return this.http.get<Traveler>(`${this.resourceUrl}/traveler/`, {params}).pipe(map((data: Traveler) => {
      return new Traveler(data);
    }));
  }

  public findById(id: number): Observable<Traveler> {
    return this.http.get<Traveler>(`${this.resourceUrl}/traveler/${id}`).pipe(map((data: Traveler) => {
      return new Traveler(data);
    }));
  }

  public create(traveler: Traveler): Observable<Traveler> {
    return this.http.post<Traveler>(`${this.resourceUrl}/traveler`, traveler).pipe(map((data: Traveler) => {
      return new Traveler(data);
    }));
  }

  public createMany(travelers: Traveler[]): Observable<Traveler[]> {
    return this.http.post<Traveler[]>(`${this.resourceUrl}/travelers`, travelers).pipe(map((data: Traveler[]) => {
      return data.map((traveler) => new Traveler(traveler));
    }));;
  }

  public update(traveler: Traveler): Observable<Traveler> {
    return this.http.put<Traveler>(`${this.resourceUrl}/traveler`, traveler).pipe(map((data: Traveler) => {
      return new Traveler(data);
    }));
  }

  public delete(_id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.resourceUrl}/traveler/${_id}`, {observe: 'response'});
  }

  public deleteAll(): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`${this.resourceUrl}/travelers`, {observe: 'response'});
  }

}
