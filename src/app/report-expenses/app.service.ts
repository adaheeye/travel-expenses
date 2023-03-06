import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {Traveler} from "./traveler.model";
import {Activity} from "./activity.model";

@Injectable()
export class AppService {
  private travelersSubject: BehaviorSubject<Traveler[]>;
  private readonly travelersObservable: Observable<Traveler[]>;
  private activitiesSubject: BehaviorSubject<Activity[]>;
  private readonly activitiesObservable: Observable<Activity[]>;

  constructor() {
    this.travelersSubject = new BehaviorSubject<Traveler[]>([]);
    this.travelersObservable = this.travelersSubject.asObservable();

    this.activitiesSubject = new BehaviorSubject<Activity[]>([]);
    this.activitiesObservable = this.activitiesSubject.asObservable();
  }

  /*public setTravellers(travelers: Traveler[]): void {
    this.travelersSubject.next(travelers);
  }

  public getTravellers(): Observable<Traveler[]> {
    return this.travelersObservable;
  }

  public setActivities(expenses: Expense[]): void {
    this.activitiesSubject.next(expenses);
  }

  public getActivities(): Observable<Expense[]> {
    return this.activitiesObservable;
  }*/

}
