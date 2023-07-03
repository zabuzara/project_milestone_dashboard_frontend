import Member from "./Member";

/**
 * Project entity class
 * */
export default class Mielstone {
    private id: string = "";
    private projectReference: string = "";
    private name: string = "";
    private description: string = "";
    private start: string = "";
    private end: string = "";
    private isCompleted: boolean = false;
    private members: Member[] = [];

    /*
    Returns the milestone id
     */
    get Id(): string {
        return this.id;
    }

    /*
    Sets the milestone id
    */
    set Id(id: string) {
        this.id = id;
    }

    /*
    Returns the project id
    */
    get ProjectReference(): string {
        return this.projectReference;
    }

    /*
    Sets the project id
    */
    set ProjectReference(id: string) {
        this.projectReference = id;
    }

    /*
    Returns the name
    */
    get Name(): string {
        return this.name;
    }

    /*
    Sets the name
    */
    set Name(name: string) {
        this.name = name;
    }

    /*
    Returns the description
    */
    get Description(): string {
        return this.description;
    }

    /*
    Sets the description
    */
    set Description(description: string) {
        this.description = description;
    }

    /*
    Returns the start date
    */
    get Start(): string {
        return this.start;
    }

    /*
    Sets the start date
    */
    set Start(start: string) {
        this.start = start;
    }

    /*
    Returns the end date
    */
    get End(): string {
        return this.end;
    }

    /*
    Sets the end date
    */
    set End(end: string) {
        this.end = end;
    }

    /*
    Returns isCompleted
    */
    get IsCompleted(): boolean {
        return this.isCompleted;
    }

    /*
    Sets isCompleted
    */
    set IsCompleted(isCompleted: boolean) {
        this.isCompleted = isCompleted;
    }

    /*
    Returns the member list
    */
    get Members(): Member[] {
        return this.members;
    }

    /*
    Sets the member list
    */
    set Members(milestones: Member[]) {
        this.members = milestones;
    }
}