import { useEffect, useState } from 'react';
import MemberTemplateComponent from '../components/member/MemberTemplateComponent';
import MemberComponent from '../components/member/MemberComponent';
import LoadingComponent from '../components/LoadingComponent';
import ErrorComponent from '../components/ErrorComponent';
import RandomColor from '../tools/RandomColor';
import Member from '../models/Member';

type MemberProps = {
    URL: {
        getAll: string,
        getById: string,
        getByName: string,
        createMember: string,
        updateMember: string,
        deleteMember: string,
    },
    TOKEN: string,
    subject: string,
}
/**
 * MemberService for CRUD operations
 * @param props
 */
export default function MemberService(props: MemberProps) {
    const [status, setStatus] = useState("loading...");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [count, setCount] = useState(0);
    const [addEnabled, setAddEnaled] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [errorMessage, setErrorMessage] = useState('error...');
    const [message, setMessage] = useState('');
    const messageShowingTime = 5000;

    useEffect(() => {
        getMembers();
    }, []);

    const removeMessage = () => setMessage('');

    /**
     * Adds a new member
     * @param newMember
     */
    const addMember = (newMember: Member) => {
        setStatus('creating...');
        setLoading(true);
        fetch(props.URL.createMember, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + props.TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMember)
        })
            .then((response) => response.json())
            .then(result => {
                if (result.success !== false)
                    setMembers([...members, result]);

                setMessage("Member Created");
            })
            .then(() => setSuccess(true))
            .then(() => setAddEnaled(false))
            .then(() => setCount(0))
            .catch(() => setError(true));

        setTimeout(removeMessage, messageShowingTime);
    };

    /**
     * Removes the member of given id
     * @param id
     */
    const deleteMember = (id: string) => {
        if (id === "member-template") {
            setCount(0);
            setAddEnaled(false);
            return;
        }
        setStatus('deleting...');
        setLoading(true);
        fetch(props.URL.deleteMember + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + props.TOKEN,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(result => {
                setMembers(members.filter(member => member.Id !== id));
                setMessage(result.message);
            })
            .then(() => setSuccess(true))
            .catch(() => setError(true));

        setTimeout(removeMessage, messageShowingTime);
    };

    /**
     * Updates the member of given id and member object
     * @param id
     * @param updatedMember
     */
    const updateMember = (id: string, updatedMember: Member) => {
        setStatus('updating...');
        setLoading(true);
        fetch(props.URL.updateMember + id, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + props.TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMember)
        })
            .then((response) => response.json())
            .then(result => {
                if (result.success !== false)
                    setMembers(members.map(member => member.Id === id ? updatedMember : member))

                setMessage(result.message);
            })
            .then(() => setSuccess(true))
            .catch(() => setError(true));

        setTimeout(removeMessage, messageShowingTime);
    };

    /**
     * Returns the member of given id
     * @param id
     */
    const getMember = (id: string) => {
        setStatus('finding...');
        setLoading(true);
        fetch(props.URL.getById + id, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.TOKEN,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(member => setMembers(member))
            .then(() => setSuccess(true))
            .catch(() => setError(true));
    };

    /**
     * Returns all members
     * */
    const getMembers = () => {
        setStatus('loading...');
        setLoading(true);
        fetch(props.URL.getAll, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + props.TOKEN,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(members => setMembers(members))
            .then(() => setSuccess(true))
            .catch(() => setError(true)); 
    };

    /**
     * Filters the member of given subject
     * @param member
     */
    const filterMember = (member: Member) => {
        return member.Firstname?.trim().toLowerCase().indexOf(props.subject.trim().toLowerCase()) > -1 ||
            member.Lastname?.trim().toLowerCase().indexOf(props.subject.trim().toLowerCase()) > -1; 
    } 

    return (
        <>
            <div className="membersContainer-crudMessage">{message}</div>
            <div className="membersContainer">
                {
                    !error && success && count < 1 ?
                        <input className="addNew" type="button" onClick={() => { setCount(count + 1); setAddEnaled(true); }} value="+" />
                    : ""
                } 
                {addEnabled && <MemberTemplateComponent key="member-template" id="member-template" color={RandomColor.get()} add={addMember} delete={deleteMember} />}
                {!success && loading && !error && <LoadingComponent content={status} />}
                {!success && error && <ErrorComponent content={errorMessage} />}
                {success && members.filter((m) => filterMember(m)).map(member => <MemberComponent key={member.Id} id={member.Id} firstname={member.Firstname} lastname={member.Lastname} color={RandomColor.get()} add={addMember} delete={deleteMember} update={updateMember} get={getMember} />)}
            </div>
        </>
    );
}