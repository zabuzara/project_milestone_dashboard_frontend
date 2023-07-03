import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CancelButtonComponent from "../buttons/CancelButtonComponent";
import AddButtonComponent from "../buttons/AddButtonComponent";
import Milestone from "../../models/Milestone";
import Member from "../../models/Member";
import moment from 'moment';

type MilestoneProps = {
    _URL:string,
    id: string,
    projectReference: string,
    members: Member[],
    color: string,
    deleteMilestone: (id: string) => void,
    addMilestone: (milestone:Milestone) =>void,
};

export default function MilestoneViewComponent(props: MilestoneProps) {
    const location = useLocation().pathname.substring(1, useLocation().pathname.length);
    const nameRef: any = useRef(null);
    const descriptionRef: any = useRef(null);
    const selectionRef: any = useRef([]);
    const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD")); 
    const startDateRef: any = useRef(null);
    const endDateRef: any = useRef(null);
    const [defaultSelected, setDefaultSelected] = useState<string[]>([]);
    const [members, setMembers] = useState<Member[]>(props.members);
    const [message, setMessage] = useState('Add Milestone'); 

    /**
     * Handles adding a new milestone
     * @param e
     * @param id
     */
    const toggleEditing = (e: any, id: string) => {
        e.stopPropagation();
        e.preventDefault();

        if (nameRef.current.textContent.trim().length > 0 &&
            descriptionRef.current.textContent.trim().length > 0 &&
            startDateRef.current.value.length > 0 &&
            endDateRef.current.value.length > 0 &&
            moment(startDateRef.current.value).toDate() <= moment(endDateRef.current.value).toDate() &&
            selectionRef.current.value !== '') {
            const newMilestone = new Milestone();
            newMilestone.Id = "";
            newMilestone.ProjectReference = props.projectReference;
            newMilestone.Name = nameRef.current.textContent.trim();
            newMilestone.Description = descriptionRef.current.textContent.trim();
            newMilestone.Start = moment(startDateRef.current.value).toDate().toISOString();
            newMilestone.End = moment(endDateRef.current.value).toDate().toISOString();
            newMilestone.IsCompleted = false;
            newMilestone.Members = members.filter(m => defaultSelected.indexOf(m.Id) > -1);
            props.addMilestone(newMilestone);
        } else {
            if (nameRef.current.textContent.trim().length == 0) setMessage('Milestone name is empty');
            else if (descriptionRef.current.textContent.trim().length == 0) setMessage('Description name is empty');
            else if (startDateRef.current.value.length == 0) setMessage('Start date not set');
            else if (endDateRef.current.value.length == 0) setMessage('End date not set');
            else if (selectionRef.current.value === '') setMessage('No member selected');
            else if (moment(startDateRef.current.value).toDate() > moment(endDateRef.current.value).toDate()) setMessage('Start Date must be less than End');
            nameRef.current.focus();
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
                <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content edit" contentEditable suppressContentEditableWarning={true} ref={nameRef}>
                </p>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-title">
                    Description
                </p>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content edit" contentEditable suppressContentEditableWarning={true} ref={descriptionRef}>
                </p>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime">
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime-label">Start</p>
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime">
                        <input className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content-datetime date" ref={startDateRef} type="date" value={startDate} onChange={handleStartDate} />
                    </div>
                </div>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime">
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime-label">End</p>
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-datetime">
                        <input className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-content-datetime date" ref={endDateRef} type="date" value={endDate} onChange={handleEndDate} />
                    </div>
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
                        <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-members-edit">
                            <select className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-members-edit-selection" defaultValue={defaultSelected} onChange={handleSelection} ref={selectionRef} multiple={true}>
                                <option disabled hidden value=''>-- choose --</option>
                                {members.map((member, index) => <option key={index} className="ganttContainer-ganttComponent-projectContainer-milestonesContainer-milestone-contentContainer-members-edit-selection-option" id={member.Id} value={member.Id}>{member.Firstname + ' ' + member.Lastname}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                : ""
            }
            {location === "overview" || location === "" ?
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer">
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons">
                        <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons-addButton" onClick={(e) => toggleEditing(e, props.id)}>
                            <AddButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons-addButton-icon' src={require('../../add-icon.png')} />
                        </button>
                        <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons-cancelButton" onClick={() => props.deleteMilestone(props.id)}>
                            <CancelButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-contentContainer-buttons-cancelButton-icon' src={require('../../cancel-icon.png')} />
                        </button>
                    </div> 
                </div>
                : ""
            }
        </div>
    );
}