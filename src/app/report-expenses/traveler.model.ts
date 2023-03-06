export class Traveler {
  public _id: string;
  public firstName: string = '';
  public lastName?: string | null;

  constructor(untyped?: any) {
    if (!untyped) {
      return;
    }

    Object.assign(this, untyped);
  }
}
