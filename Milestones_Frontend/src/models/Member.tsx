/**
 * Member entity class
 * */
export default class Member {
    private id: string = "";
    private firstname: string = "";
    private lastname: string = "";

    /*
     Returns the member id
     */
    get Id(): string {
        return this.id;
    }

    /*
     Sets the member id
     */
    set Id(id: string) {
        this.id = id;
    }

    /*
     Returns the member firstname
     */
    get Firstname(): string {
        return this.firstname;
    }

    /*
     Sets the member firstname
     */
    set Firstname(firstname: string) {
        this.firstname = firstname;
    }

    /*
     Returns the member lastname
     */
    get Lastname(): string {
        return this.lastname;
    }

    /*
     Sets the member lastname
     */
    set Lastname(lastname: string) {
        this.lastname = lastname;
    }
}