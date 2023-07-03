import MemberServices from '../services/MemberServices';

type MemberProps = {
    URL:string,
    subject: string
}

/**
 * Member function for showing/editing/removing/adding/updating all members
 * @param props
 */
export default function Members(props: MemberProps) {
    const url = {
        getAll: props.URL +'api/member/getall',
        getById: props.URL +'api/member/getbyid/',
        getByName: props.URL +'api/member/getbyname/',
        createMember: props.URL +'api/member/createmember',
        updateMember: props.URL +'api/member/updatemember/',
        deleteMember: props.URL +'api/member/deletemember/', 
    };
    const token: string = "";
    return (
        <MemberServices URL={url} TOKEN={token} subject={props.subject}/>
    );
}