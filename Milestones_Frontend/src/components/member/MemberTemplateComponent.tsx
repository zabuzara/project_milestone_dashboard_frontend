import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import DeleteButtonComponent from "../buttons/DeleteButtonComponent";
import AddButtonComponent from "../buttons/AddButtonComponent";
import Member from "../../models/Member";
import CancelButtonComponent from "../buttons/CancelButtonComponent";

type MemberProps = {
    id: string,
    color: string,
    add: (newMember: Member) => void,
    delete: (id: string) => void,
};

export default function MemberComponent(props: MemberProps) {
    const location = useLocation().pathname.substring(1, useLocation().pathname.length);
    const firstnameRef: any = useRef(null);
    const lastnameRef: any = useRef(null);
    const [message, setMessage] = useState(''); 

    const handleAdd = () => {
        if (firstnameRef.current.textContent.trim().length > 0 &&
            lastnameRef.current.textContent.trim().length > 0) {
            const newMember = new Member();
            newMember.Firstname = firstnameRef.current.textContent.trim();
            newMember.Lastname = lastnameRef.current.textContent.trim();
            props.add(newMember)
        } else {
            if (firstnameRef.current.textContent.trim().length == 0) setMessage('Firstname is empty');
            else if (lastnameRef.current.textContent.trim().length == 0) setMessage('Lastname is empty');
            firstnameRef.current.focus();
        }
    };

    useEffect(() => {
        firstnameRef.current.focus();
    });

    return (
        <div className="membersContainer-memberComponent" key={props.id} style={{ backgroundColor: props.color }}>
            <div className="membersContainer-memberComponent-messageBox">
                <span className="membersContainer-memberComponent-messageBox-leftMessage">{message}</span>
            </div>
            <div className="membersContainer-memberComponent-contentContainer">
                <p className="membersContainer-memberComponent-contentContainer-title">
                    Firstname
                </p>
            </div>
            <div className="membersContainer-memberComponent-contentContainer">
                <p className="membersContainer-memberComponent-contentContainer-content edit" contentEditable suppressContentEditableWarning={true} ref={firstnameRef}>

                </p>
            </div>
            <div className="membersContainer-memberComponent-contentContainer">
                <p className="membersContainer-memberComponent-contentContainer-title">
                    Lastname
                </p>
            </div>
            <div className="membersContainer-memberComponent-contentContainer">
                <p className="membersContainer-memberComponent-contentContainer-content edit" contentEditable suppressContentEditableWarning={true} ref={lastnameRef}>

                </p>
            </div>
            {location.length > 0 && location === "members" ?
                <div className="membersContainer-memberComponent-contentContainer">
                    <div className="membersContainer-memberComponent-contentContainer-buttons">
                        <button className="membersContainer-memberComponent-contentContainer-buttons-editButton" onClick={handleAdd}>
                            <AddButtonComponent class='membersContainer-memberComponent-contentContainer-buttons-editButton-icon' src={require('../../add-icon.png')} />
                        </button>
                        <button className="membersContainer-memberComponent-contentContainer-buttons-cancelButton" onClick={(e) => props.delete("member-template")}>
                            <CancelButtonComponent class='membersContainer-memberComponent-contentContainer-buttons-cancelButton-icon' src={require('../../cancel-icon.png')} />
                        </button>
                    </div>
                </div>
                : ""
            }
        </div>
    );
}