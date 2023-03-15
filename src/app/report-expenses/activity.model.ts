import {Traveler} from "./traveler.model";

export class Activity {
  public _id: string;
  public activityName: string = '';
  public activityDate?: string;
  public amount: number = 0;
  public paidBy: Traveler;
  public owedBy: Traveler[] = [];
  public details: string = '';
  public isPayeeInclude: boolean = true; // TODO this will be used

  constructor(untyped?: any) {
    if (!untyped) {
      return;
    }

    Object.assign(this, untyped);

    if (typeof this.paidBy === 'string') {
      this.paidBy = new Traveler({
        _id: this.paidBy
      })
    }
    if (this.owedBy.length && typeof this.owedBy[0] === 'string') {
      this.owedBy = this.owedBy.map((oB) => new Traveler({
        _id: oB
      }))
    }

    // console.log('Before, this.paidBy: ', this.paidBy);
    // if (this.paidBy) {
    //   this.paidBy = new Traveler({
    //     _id: untyped.paidBy
    //   })
    // }
    // console.log('After, this.paidBy: ', this.paidBy);
  }
}
