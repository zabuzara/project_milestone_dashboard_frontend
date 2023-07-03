import Milestone from "./Milestone";

/**
 * Project entity class
 * */
export default class Project {
    private id: string = "";
    private name: string = "";
    private start: string = "";
    private end: string = "";
    private milestones: Milestone[] = [];

    /*
     * Returns the id
     */
    get Id(): string {
        return this.id;
    }

    /*
     * Sets the id
     */
    set Id(id: string) {
        this.id = id;
    }

    /*
     * Returns the id
     */
    get Name(): string {
        return this.name;
    }

    /*
     * Sets the id
     */
    set Name(name: string) {
        this.name = name;
    }

    /*
     * Returns the id
     */
    get Start(): string {
        return this.start;
    }

    /*
     * Sets the id
     */
    set Start(start: string) {
        this.start = start;
    }

    /*
     * Returns the id
     */
    get End(): string {
        return this.end;
    }

    /*
     * Sets the id
     */
    set End(end: string) {
        this.end = end;
    }

    /*
     * Returns the id
     */
    get Milestones(): Milestone[] {
        return this.milestones;
    }

    /*
     * Sets the id
     */
    set Milestones(milestones: Milestone[]) {
        this.milestones = milestones;
    }
}