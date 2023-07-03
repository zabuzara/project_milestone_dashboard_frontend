import { useEffect, useRef, useState } from 'react';
import MilestoneViewTemplateComponent from './MilestoneViewTemplateComponent';
import MilestoneBlockComponent from './MilestoneBlockComponent';
import CancelButtonComponent from '../buttons/CancelButtonComponent';
import DeleteButtonComponent from '../buttons/DeleteButtonComponent';
import EditButtonComponent from '../buttons/EditButtonComponent';
import SaveButtonComponent from '../buttons/SaveButtonComponent';
import RandomColor from '../../tools/RandomColor';
import Milestone from '../../models/Milestone';
import Project from '../../models/Project';
import Member from '../../models/Member';
import moment from 'moment';

type ProjectBlockProps = {
    _URL: string,
    reloadProjects:()=>void,
    project: Project,
    milestones: Milestone[],
    isEditing: boolean,
    timeline: { from: Date, to: Date },
    add: (newProject: Project) => void,
    delete: (id: string) => void,
    update: (id: string, updatedProject: Project) => void,
    get: (id: string) => void,
}

export default function ProjectBlockComponent(props: ProjectBlockProps) {
    const [isEditing, setEditing] = useState(props.isEditing);
    const [count, setCount] = useState(0);
    const [addEnabled, setAddEnaled] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);
    const [completedIds, setCompletedIds] = useState<string[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>(props.project.Milestones);
    const [startDate, setStartDate] = useState(updateProjectStartDate().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(updateProjectEndDate().format("YYYY-MM-DD")); 
    const projectName: any = useRef(null);
    const startDateRef: any = useRef(null);  
    const endDateRef: any = useRef(null);
    const [message, setMessage] = useState(''); 
    const [deleted, setDeleted] = useState(false);
    const showingMessageTime = 5000;

    /**
     * Updates the project start date in project component in overview
     * */
    function updateProjectStartDate() {
        return moment(milestones.length > 0 ? Array.from(milestones).map(milestone => moment(milestone.Start)).sort((a, b) => a.toDate() < b.toDate() ? -1 : 1)[0] : moment().format("11.03.1971"));
    }

    /**
     * Updates the project end date in project component in overview
     * */
    function updateProjectEndDate() {
        return moment(milestones.length > 0 ? Array.from(milestones).map(milestone => moment(milestone.End)).sort((a, b) => a.toDate() > b.toDate() ? -1 : 1)[0] : moment().format("11.03.1971"));
    }

    useEffect(() => {
        setCompletedIds(Array.from(props.project.Milestones.filter(m => m !== null && m.IsCompleted)).map(m => m.Id));
        setStartDate(updateProjectStartDate().format("YYYY-MM-DD"));
        setEndDate(updateProjectEndDate().format("YYYY-MM-DD"));
    }, [props.timeline, props.reloadProjects]);

    /**
     * Toggles between edit and save button
     * @param id
     */
    const toggleEditing = (id: string) => {
        if (isEditing) {
            if (projectName.current.textContent.trim().length > 0) {
                const updatedProject = new Project(); 
                updatedProject.Id = props.project.Id;
                updatedProject.Name = projectName.current.textContent;
                updatedProject.Milestones = props.milestones;
                updatedProject.Start = updateProjectStartDate().toISOString();
                updatedProject.End = updateProjectEndDate().toISOString();
                props.update(props.project.Id, updatedProject);
                setMessage(''); 
                setEditing(!isEditing);
            } else {
                if (projectName.current.textContent.trim().length == 0) setMessage('Project name is empty');
                else if (startDateRef.current.value.length == 0) setMessage('Start date not set');
                else if (endDateRef.current.value.length == 0) setMessage('End date not set');
            }
        } else {
            setMessage('Edit Mode');
            setEditing(!isEditing);
        }
    };

    /**
     * auto remove function for calling with setTimeout()
     * */
    const removeMessage = () => setMessage('');


    /**
     * Shows the completed or opens milestones on click of button
     * */
    const handleCompleted = () => {
        setShowCompleted(!showCompleted);
        !showCompleted ? setMessage('Completed Milestones') : setMessage('Opens Milestones');
        setTimeout(removeMessage, showingMessageTime);
    }

    /**
      * Returns the open or completed Tag on top-right of project component 
      * */
    const getCompletedTag = () => {
        return milestones.length != 0 && milestones.length == milestones.filter(milestone => milestone.IsCompleted).length ? "Completed" : "Open";
    }

    /**
     * Reloads the completed milestones ids
     * @param id
     * @param value
     */
    const handleRealod = (id: string, value: boolean) => {
        if (value) {
            setCompletedIds([...completedIds, id]);
        } else {
            setCompletedIds(completedIds.filter(i => i !== id));
        }
    }

    /**
     * Handles the changing value of start date
     * @param e
     */
    const handleStartDate = (e: any) => {
        setStartDate(startDateRef.current.value);
    };

    /**
     * Handles the changing value of end date
     * @param e
     */
    const handleEndDate = (e: any) => {
        setEndDate(endDateRef.current.value);
    };

    /**
     * Sets Deleted auf true
     * @param e
     */
    const handleDelete = () => {
        setDeleted(true);
    }

    /**
     * Adds new milestone
     * @param milestone
     */
    const addMilestone = (milestone: Milestone) => {
        fetch(props._URL + 'api/milestone/createmilestone', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(milestone)
        })
            .then((response) => response.json())
            .then(result => {
                if (result.success !== false)
                    setMilestones([...milestones, result]);
            })
            .then(() => setAddEnaled(false))
            .then(() => setCount(0));
        props.reloadProjects();
    } 

    /**
     * Updates the milestone of given milestone and id
     * @param id
     * @param updatedMilestone
     */
    const updateMilestone = (id: string, updatedMilestone:Milestone) => {
        fetch(props._URL + 'api/milestone/updatemilestone/'+id, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMilestone)
        })
            .then((response) => response.json())
            .then(result => {
                setMilestones(milestones.map(milestone => milestone.Id === id ? updatedMilestone : milestone));
                setMessage(result.message);
            });

        setStartDate(updateProjectStartDate().format("YYYY-MM-DD"));
        setEndDate(updateProjectEndDate().format("YYYY-MM-DD"));
        setTimeout(removeMessage, showingMessageTime);
    } 

    /**
     * Deletes the milestone of given id
     * @param id
     */
    const deleteMilestone = (id: string) => {
        if (id === "milestone-template") {
            setCount(0);
            setAddEnaled(false);
            return;
        }
        fetch(props._URL + 'api/milestone/deletemilestone/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(result => {
                setMilestones(milestones.length > 1 ? milestones.filter(milestone => milestone.Id !== id) : []);
                setMessage(result.message);
            });
        props.reloadProjects();
        setTimeout(removeMessage, showingMessageTime);
    } 

    /**
     * Returns the UNIQUE member names from milestones
     * for showing in Head of project component (Members: ...)
     * */
    function getUniqueMemberNames():string[] {
        let uniqueNames: string[] = [];
        milestones.map(milestone => milestone.Members.map(member => uniqueNames.indexOf(member.Firstname + ' ' + member.Lastname) == -1 ? uniqueNames.push(member.Firstname + ' ' + member.Lastname) : null))
        return uniqueNames;
    }

    return (
        <div>
            <div className="ganttContainer-ganttComponent-projectComponent-messageBox">
                <span className="ganttContainer-ganttComponent-projectComponent-messageBox-leftMessage">{message}</span>
                {deleted ?
                    <div className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox">
                        <span className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox-message">Are you sure?</span>
                        <button className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox-yesButton" onClick={() => props.delete(props.project.Id)}>Yes</button>
                        <button className="ganttContainer-ganttComponent-projectComponent-messageBox-deletingBox-noButton" onClick={() => { setEditing(false); setMessage(''); setDeleted(false); }}>No</button>
                    </div>
                    : ''}
                <span className="ganttContainer-ganttComponent-projectComponent-messageBox-rightMessage expired">{getCompletedTag()}</span>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer" style={{ backgroundColor: RandomColor.get() }}>
                {isEditing
                    ?
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-name edit" contentEditable suppressContentEditableWarning={true} ref={projectName}>
                        {props.project.Name}
                    </p>
                    :
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-name">
                        {props.project.Name}
                    </p>
                    }
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-datetime" >
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-datetime-start" >
                        <span className="ganttContainer-ganttComponent-projectComponent-projectContainer-datetime-start-label">Start: </span>
                        <span className="ganttContainer-ganttComponent-projectComponent-projectContainer-datetime-start-value">{updateProjectStartDate().format("DD.MM.YYYY")}</span>
                    </div>
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-datetime-end" >
                        <span className="ganttContainer-ganttComponent-projectComponent-projectContainer-datetime-end-label">End: </span>
                        <span className="ganttContainer-ganttComponent-projectComponent-projectContainer-datetime-end-value">{updateProjectEndDate().format("DD.MM.YYYY")}</span>
                    </div>
                </div>
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-members">
                    <span className="ganttContainer-ganttComponent-projectComponent-projectContainer-members-label">Members: </span>
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-members-value">
                        {getUniqueMemberNames().length == 0
                            ?
                            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-members-value-member" style={{ backgroundColor: RandomColor.get() }}>empty</div>
                            : ''
                        }
                        {getUniqueMemberNames().map((name, index) =>
                            <div key={index} className="ganttContainer-ganttComponent-projectComponent-projectContainer-members-value-member" style={{ backgroundColor: RandomColor.get() }}>{name}</div>)
                        }
                    </div>
                </div>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-buttons">
                <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-editButton" onClick={(id) => toggleEditing(props.project.Id)}>
                    {isEditing
                        ?
                        <SaveButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-saveButton-icon' src={require('../../save-icon.png')} />
                        :
                        !deleted ? <EditButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-editButton-icon' src={require('../../edit-icon.png')} /> : ''
                    }
                </button>
                {isEditing
                    ?
                    <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-cancelButton" onClick={() => { setEditing(false); setMessage(''); } }>
                        <CancelButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-cancelButton-icon' src={require('../../cancel-icon.png')} />
                    </button>
                    :
                    !deleted ?
                        <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-deleteButton" onClick={(id) => handleDelete()}>
                            <DeleteButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-deleteButton-icon' src={require('../../delete-icon.png')} />
                    </button>
                    : ''
                }
                {isEditing 
                    ?
                    ''
                    :
                    showCompleted
                        ?
                        <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-openButton" onClick={handleCompleted}>
                            <DeleteButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-openButton-icon' src={require('../../open-icon.png')} />
                        </button>
                        :
                        !deleted
                            ?
                            <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-completedButton" onClick={handleCompleted}>
                                <DeleteButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-completedButton-icon' src={require('../../complete-icon.png')} />
                            </button>
                            :
                            ''
                }

            </div>
            {!isEditing ? 
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer" style={{ backgroundColor: RandomColor.get() }}> 
                    {
                        count < 1 && !showCompleted && !deleted ? 
                            <input className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-addNew" type="button" onClick={() => { setCount(count + 1); setAddEnaled(true); }} value="+" />
                            : ""
                    }
                    {addEnabled && <MilestoneViewTemplateComponent _URL={props._URL} key="milestone-template" id="milestone-template" projectReference={props.project.Id} members={members} color={RandomColor.get()} addMilestone={addMilestone} deleteMilestone={deleteMilestone} />}
                    {
                        !showCompleted 
                            ?
                            milestones.filter(m => (m != null && !m.IsCompleted && completedIds.indexOf(m.Id) == -1 && ((new Date(m.End) >= props.timeline.from || new Date(m.Start) >= props.timeline.from) || (new Date(m.End) <= props.timeline.to || new Date(m.Start) <= props.timeline.to))))/*.sort((m1, m2) => m1.End < m2.End ? -1 : 0).sort((m1, m2) => m1.End < m2.End ? -1 : 0)*/.map((milestone, index) =>
                                <MilestoneBlockComponent _URL={props._URL}  key={index} reloadProjects={props.reloadProjects} milestone={milestone} milestoneMember={milestone.Members} members={members} color={RandomColor.get()} project={props.project} reload={handleRealod} updateMilestone={updateMilestone} deleteMilestone={deleteMilestone} />)
                            :
                            milestones.filter(m => (m != null && m.IsCompleted && ((new Date(m.End) >= props.timeline.from || new Date(m.Start) >= props.timeline.from) || (new Date(m.End) <= props.timeline.to || new Date(m.Start) <= props.timeline.to))))/*.sort((m1, m2) => m1.End < m2.End ? -1 : 0).sort((m1, m2) => m1.End < m2.End ? -1 : 0)*/.map((milestone, index) =>
                                <MilestoneBlockComponent _URL={props._URL}  key={index} reloadProjects={props.reloadProjects} milestone={milestone} milestoneMember={milestone.Members} members={members} color={RandomColor.get()} project={props.project} reload={handleRealod} updateMilestone={updateMilestone} deleteMilestone={deleteMilestone } />)
                    }
                </div>
                :
                ''
            } 
      </div>
  );
}