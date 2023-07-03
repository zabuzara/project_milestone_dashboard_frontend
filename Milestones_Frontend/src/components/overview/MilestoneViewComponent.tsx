import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CancelButtonComponent from "../buttons/CancelButtonComponent";
import DeleteButtonComponent from "../buttons/DeleteButtonComponent";
import SaveButtonComponent from "../buttons/SaveButtonComponent";
import EditButtonComponent from "../buttons/EditButtonComponent";
import RandomColor from "../../tools/RandomColor";
import Milestone from "../../models/Milestone";
import Member from "../../models/Member";
import moment from 'moment';

type MilestoneProps = {
    _URL:string,
    reloadProjects: () => void,
    id: string,
    projectReference: string,
    name: string,
    description: string,
    start: string,
    end: string,
    isCompleted: boolean,
    milestoneMembers: Member[],
    members: Member[],
    color: string,
    handleCancel: (id:string) => void,
    showMilestone: (e: any, milestonId: string) => void,
    updateMilestone: (id: string, milestone: Milestone) => void,
    deleteMilestone: (id: string) => void,
    updateMemebrList: (members:Member[]) =>void,
};

export default function MilestoneViewComponent(props: MilestoneProps) {
    const location = useLocation().pathname.substring(1, useLocation().pathname.length);
    const [isEditing, setEditing] = useState(false);
    const nameRef: any = useRef(null);
    const descriptionRef: any = useRef(null);
    const completedRef: any = useRef(null);
    const selectionRef: any = useRef([]);
    const [startDate, setStartDate] = useState(moment(props.start).format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(moment(props.end).format("YYYY-MM-DD")); 
    const startDateRef: any = useRef(null);
    const endDateRef: any = useRef(null);
    const [completed, setCompleted] = useState(props.isCompleted);
    const [defaultSelected, setDefaultSelected] = useState(Array.from(props.milestoneMembers).map(m => m.Id));
    const [members, setMembers] = useState<Member[]>(props.members);
    const [deleted, setDeleted] = useState(false);
    const [message, setMessage] = useState(''); 

    /**
     * Handles toggles between edit/save for milestone
     * @param e
     * @param id
     */
    const toggleEditing = (e: any, id: string) => {
        e.stopPropagation();
        e.preventDefault();
        if (isEditing) {
            if (nameRef.current.textContent.trim().length > 0 &&
                descriptionRef.current.textContent.trim().length > 0 &&
                startDateRef.current.value.length > 0 &&
                endDateRef.current.value.length > 0 &&
                moment(startDateRef.current.value).toDate() <= moment(endDateRef.current.value).toDate() &&
                selectionRef.current.value !== '') {
                const updatedMilestone = new Milestone();
                updatedMilestone.Id = props.id;
                updatedMilestone.ProjectReference = props.projectReference;
                updatedMilestone.Name = nameRef.current.textContent.trim();
                updatedMilestone.Description = descriptionRef.current.textContent.trim();
                updatedMilestone.Start = moment(startDateRef.current.value).toDate().toISOString();
                updatedMilestone.End = moment(endDateRef.current.value).toDate().toISOString();
                updatedMilestone.IsCompleted = completed;
                updatedMilestone.Members = members.filter(m => defaultSelected.indexOf(m.Id) > -1);
                props.updateMemebrList(updatedMilestone.Members);
                props.updateMilestone(props.id, updatedMilestone);
                props.handleCancel(props.id);
                setMessage(''); 
                setEditing(!isEditing);
                props.reloadProjects();
            } else {
                if (nameRef.current.textContent.trim().length == 0) setMessage('Milestone name is empty');
                else if (descriptionRef.current.textContent.trim().length == 0) setMessage('Description name is empty');
                else if (startDateRef.current.value.length == 0) setMessage('Start date not set');
                else if (endDateRef.current.value.length == 0) setMessage('End date not set');
                else if (selectionRef.current.value === '') setMessage('No member selected');
                else if (moment(startDateRef.current.value).toDate() > moment(endDateRef.current.value).toDate()) setMessage('Start Date must be less than End');
                nameRef.current.focus();
            }
        } else {
            setMessage('Edit Mode');
            setEditing(!isEditing);
        }
    };

    useEffect(() => {
        getMembers();
        nameRef?.current?.focus();
    }, []);

    /**
     * Handle changing the value of options for select element for member´s
     * @param e
     */
    const handleSelection = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDefaultSelected(Array.from(e.target.selectedOptions).map((o: any) => o.value));
    };

    /**
     * Handles changing value of start date
     * @param e
     */
    const handleStartDate = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setStartDate(startDateRef.current.value);
    };

    /**
       * Handles changing value of end date
       * @param e
       */
    const handleEndDate = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setEndDate(endDateRef.current.value);
    };
  

    /**
      * Returns all memebrs
     * */
    const getMembers = () => {
        fetch(props._URL + 'api/member/getall', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(members => setMembers(members));
    }

    return (
        <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone" key={props.id} style={{ backgroundColor: props.color }}>
            <div className="ganttContainer-ganttComponent-projectComponent-messageBox">
                <span className="ganttContainer-ganttComponent-projectComponent-messageBox-leftMessage">{message}</span>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-title">
                    Name
                </p>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                {isEditing ?
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content edit" contentEditable suppressContentEditableWarning={true} ref={nameRef}>
                        {props.name}
                    </p>
                    :
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content">
                        {props.name}
                    </p>
                }
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-title">
                    Description
                </p>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                {isEditing ?
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content edit" contentEditable suppressContentEditableWarning={true} ref={descriptionRef}>
                        {props.description}
                    </p>
                    :
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content">
                        {props.description}
                    </p>
                }
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime">
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime-label">Start</p>
                    {isEditing
                        ?
                        <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime">
                            <input className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content-datetime date" ref={startDateRef} type="date" value={startDate} onChange={handleStartDate} />
                        </div>
                        :
                        <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime">
                            <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content">
                                {moment(startDate).format("DD.MM.YYYY")}
                            </p>
                        </div>
                    }
                </div>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime">
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime-label">End</p>
                    {isEditing
                    ?
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime">
                        <input className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content-datetime date" ref={endDateRef} type="date" value={endDate} onChange={handleEndDate} />
                    </div>
                    :
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime">
                        <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content">
                                {moment(endDate).format("DD.MM.YYYY")}
                        </p>
                    </div>
                    }
                </div>
            </div>
            
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-completedTag">
                    Completed
                    {isEditing ?
                        <input type="checkbox" className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-completedTag-content edit" checked={completed} onChange={(e) => setCompleted(e.target.checked)} ref={completedRef} />
                        :
                        <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-completedTag-content">
                            {completed ? "Yes" : "No"}
                        </p>
                    }
                </div>
            </div>
            {location === "overview" || location === ""  ?
                <div>
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                        <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-title">
                            Members
                        </p>
                    </div>
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                        {isEditing ?
                            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-members-edit">
                                <select className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-members-edit-selection" defaultValue={defaultSelected} onChange={handleSelection} ref={selectionRef} multiple={true}>
                                    <option disabled hidden value=''>-- choose --</option>
                                    {members.map((member, index) => <option key={index} className="ganttContainer-ganttComponent-projectContainer-milestonesContainer-milestone-contentContainer-members-edit-selection-option" id={member.Id} value={member.Id}>{member.Firstname + ' ' + member.Lastname}</option>)}
                                </select>
                            </div>
                            :
                            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-members">
                                {props.milestoneMembers.map((member, index) => <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-members-member" key={index} style={{ backgroundColor: RandomColor.get() }}>{member.Firstname + ' ' + member.Lastname}</div>)}
                            </div>
                        }
                    </div>
                </div>
                : ""
            }
            {location === "overview" || location === "" ?
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                    {deleted ?
                        <div className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox">
                            <span className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox-message">Are you sure?</span>
                            <button className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox-yesButton" onClick={() => props.deleteMilestone(props.id)}>Yes</button>
                            <button className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox-noButton" onClick={() => { setEditing(false); setDeleted(false); }}>No</button>
                        </div>
                        :
                        <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons">
                            <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons-editButton" onClick={(e) => toggleEditing(e, props.id)}>
                                {isEditing
                                    ?
                                    <SaveButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons-editButton-icon' src={require('../../save-icon.png')} />
                                    :
                                    <EditButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons-editButton-icon' src={require('../../edit-icon.png')} />
                                }
                            </button>
                            <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons-deleteButton" onClick={() => props.handleCancel(props.id)}>
                                <CancelButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons-deleteButton-icon' src={require('../../cancel-icon.png')} />
                            </button>
                            <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons-deleteButton" onClick={()=>setDeleted(true)}>
                                <DeleteButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons-deleteButton-icon' src={require('../../delete-icon.png')} />
                            </button>
                        </div> 
                    }
                </div>
                : ""
            }
        </div>
    );
}