import { Activity } from "../activity.model";

export class ExcludePayeeUtil {

    public static ALL = 'all';

    /*public static getExpenses(expenses: Expense[]): Expense[] {
        return expenses.map((expense) => {
            if (this.isPayeeInOweeColumn(expense)) {
                // update Amount and Owee columns
                expense.amount = this.getAmount(expense);
                expense.owedBy = this.getOweeNames(expense);
                return expense;
            } else {
                return expense;
            }
        })
    }
    public static getAmount(expense: Expense): number {
        const numOfTravelers = this.isOweeAll(expense) ? this.getTravelers().length : expense.owedBy.length;
        const perPersonAmount = expense.amount / numOfTravelers;
        return expense.amount -= perPersonAmount;
    }

    /!**
     * Returns owe users without the payee user
     *!/
    public static getOweeNames(expense: Expense): string[] {
        let travelers = this.getTravelers();
        if (this.isOweeAll(expense)) {
            travelers = travelers.filter((travler) => travler !== expense.paidBy)
        } else if (this.isPayeeInOwee(expense)) {
            travelers = expense.owedBy.filter((owee) => owee !== expense.paidBy);
        }
        return travelers;
    }

    public static getTravelers(): string[] {
      return []; // TODO return [...Object.values(TravelerEnum)].map((traveler) => traveler.toString());
    }

    public static isPayeeInOweeColumn(expense: Expense): boolean {
        return this.isOweeAll(expense) || this.isPayeeInOwee(expense);
    }

    public static isPayeeInOwee(expense: Expense): boolean {
        return [...expense.owedBy.map((owee) => owee.toLowerCase()), this.ALL].includes(expense.paidBy.toLowerCase())
    }

    public static isOweeAll(expense: Expense): boolean {
        return expense.owedBy.length === 1 && expense.owedBy[0].toLowerCase() === this.ALL;
    }*/

}
