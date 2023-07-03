import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import DeleteButtonComponent from "../buttons/DeleteButtonComponent";
import CancelButtonComponent from "../buttons/CancelButtonComponent";
import EditButtonComponent from "../buttons/EditButtonComponent";
import SaveButtonComponent from "../buttons/SaveButtonComponent";
import Member from "../../models/Member";

type MemberProps = {
    id: string,
    firstname: string,
    lastname: string,
    color: string,
    add: (newMember: Member) => void,
    delete: (id: string) => void,
    update: (id: string, updatedMember: Member) => void,
    get: (id: string) => void,
};

export default function MemberComponent(props: MemberProps) {
    const location = useLocation().pathname.substring(1, useLocation().pathname.length);
    const [isEditing, setEditing] = useState(false);
    const firstnameRef: any = useRef(null);
    const lastnameRef: any = useRef(null);
    const [deleted, setDeleted] = useState(false);
    const [message, setMessage] = useState(''); 

    const toggleEditing = (id: string) => {

        if (isEditing) {
            if (firstnameRef.current.textContent.length > 0 &&
                lastnameRef.current.textContent.length > 0) {
                const updatedMember = new Member();
                updatedMember.Id = props.id;
                updatedMember.Firstname = firstnameRef.current.textContent;
                updatedMember.Lastname = lastnameRef.current.textContent;
                props.update(props.id, updatedMember);
                setEditing(!isEditing);
                setMessage('');
            }
            if (firstnameRef?.current?.textContent?.trim().length == 0) setMessage('Firstname is empty');
            else if (lastnameRef?.current?.textContent?.trim().length == 0) setMessage('Lastname is empty');
        } else {
            setEditing(!isEditing);
        }
    };

    useEffect(() => {
        firstnameRef?.current?.focus();
    });

    return (
        <div className="membersContainer-memberComponent" key={props.id} style={{ backgroundColor: props.color }}>
            {isEditing
                ?
                <div className="membersContainer-memberComponent-messageBox">
                    <span className="membersContainer-memberComponent-messageBox-leftMessage">{message}</span>
                </div>
                :
                ''
            }
            <div className="membersContainer-memberComponent-contentContainer">
                <p className="membersContainer-memberComponent-contentContainer-title">
                    Firstname
                </p>
            </div>
            <div className="membersContainer-memberComponent-contentContainer">
                {isEditing ?
                    <p id={props.id} className="membersContainer-memberComponent-contentContainer-content edit" contentEditable suppressContentEditableWarning={true} ref={firstnameRef}>
                        {props.firstname}
                    </p>
                    :
                    <p className="membersContainer-memberComponent-contentContainer-content">
                        {props.firstname}
                    </p>
                }
            </div>
            <div className="membersContainer-memberComponent-contentContainer">
                <p className="membersContainer-memberComponent-contentContainer-title">
                    Lastname
                </p>
            </div>
            <div className="membersContainer-memberComponent-contentContainer">
                {isEditing ?
                    <p id={props.id} className="membersContainer-memberComponent-contentContainer-content edit" contentEditable suppressContentEditableWarning={true} ref={lastnameRef}>
                        {props.lastname}
                    </p>
                    :
                    <p className="membersContainer-memberComponent-contentContainer-content">
                        {props.lastname}
                    </p>
                }
            </div>
            {location.length > 0 && location === "members" ?
                <div className="membersContainer-memberComponent-contentContainer">
                    {deleted ?
                        <div className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox">
                            <span className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox-message">Are you sure?</span>
                            <button className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox-yesButton" onClick={() => props.delete(props.id)}>Yes</button>
                            <button className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox-noButton" onClick={() => { setEditing(false); setDeleted(false); }}>No</button>
                        </div>
                        :
                        <div className="membersContainer-memberComponent-contentContainer-buttons">
                            <button className="membersContainer-memberComponent-contentContainer-buttons-editButton" onClick={(id) => toggleEditing(props.id)}>
                                {isEditing
                                    ?
                                    <SaveButtonComponent class='membersContainer-memberComponent-contentContainer-buttons-editButton-icon' src={require('../../save-icon.png')} />
                                    :
                                    <EditButtonComponent class='membersContainer-memberComponent-contentContainer-buttons-editButton-icon' src={require('../../edit-icon.png')} />
                                }
                            </button>
                            {isEditing
                                ?
                                <button className="membersContainer-memberComponent-contentContainer-buttons-deleteButton" onClick={() => setEditing(false)}>
                                    <CancelButtonComponent class='membersContainer-memberComponent-contentContainer-buttons-deleteButton-icon' src={require('../../cancel-icon.png')} />
                                </button>
                                :
                                <button className="membersContainer-memberComponent-contentContainer-buttons-deleteButton" onClick={(e) => setDeleted(true)}>
                                    <DeleteButtonComponent class='membersContainer-memberComponent-contentContainer-buttons-deleteButton-icon' src={require('../../delete-icon.png')} />
                                </button>
                            }
                        </div>
                    }
                </div>
                : ""
            }
        </div>
    );
}