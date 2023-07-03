import { useState } from 'react';
import MilestoneViewComponent from './MilestoneViewComponent';
import RandomColor from '../../tools/RandomColor';
import Milestone from '../../models/Milestone';
import Project from '../../models/Project';
import Member from '../../models/Member';
import moment from 'moment';

type MilestoneBlockProps = {
    _URL :string,
    reloadProjects: () => void,
    milestone: Milestone, 
    members: Member[],
    milestoneMember: Member[],
    color: string,
    project: Project,
    reload: (id: string, value: boolean) => void,
    updateMilestone:(id:string,milestone:Milestone) => void,
    deleteMilestone:(id:string) => void,
}

export default function MilestoneBlockComponent(props: MilestoneBlockProps) {
    const [showMilestone, setShowMilestone] = useState(false);
    const hourDiff = moment(moment(props.milestone.Start).format('YYYY-MM-DDT00:00:00')) < moment(Date.now()) ? (moment(moment(props.milestone.End).format('YYYY-MM-DDT23:59:59')).diff(moment((moment(props.milestone.Start).format('YYYY-MM-DDT00:00:00'))))) / 3600000 : 0;
    const diffFromStartToNow = moment(Date.now()).diff(moment(props.milestone.Start).format('YYYY-MM-DDT00:00:00')) > 0 ? moment(Date.now()).diff(moment(props.milestone.Start).format('YYYY-MM-DDT00:00:00')) / 3600000 : 0;
    const [updatedMemberList, setUpdatedMemberList] = useState<Member[]>(props.milestoneMember);
    const LEVELS = {
        NONSIGNIFICANT: 'linear-gradient(to right, #eee 0%, #00ff3c 100%)',
        IMPORTANT: 'linear-gradient(to right, #eee 0%, #ffb100 100%)',
        VERY_IMPORTANT: 'linear-gradient(to right, #eee 0%, #ff0000 100%)'
    }

    /**
     * Shows the milestone details on click in Overview
     * @param e
     * @param milestonId
     */
    const handleClick = (e: any, milestonId: string) => {
        e.stopPropagation();
        e.preventDefault();
        setShowMilestone(!showMilestone);
    }

    /**
     * Updates the member names block in each project block after 
     * adding/deleting/updating the milestone
     * @param members
     */
    const updateMemebrList = (members: Member[]) => {
        setUpdatedMemberList(members);
    }

    /**
     * Shifts the milestone one day forwards
     * @param e
     */
    const handleShift = (e: any) => {
        e.stopPropagation();
        const date = moment(props.milestone.End).add(1, "d");
        const milestone = props.milestone;
        milestone.End = date.toDate().toISOString()
        props.updateMilestone(milestone.Id, milestone);
    }

    /**
     * Calculates the progress bar to showing progress precentage
     * @param hDiff
     * @param diffStartToNow
     */
    function calculateRemaining(hDiff:number, diffStartToNow:number) {
        return (hDiff > diffStartToNow ? Math.round(diffStartToNow / (hDiff / 100)) : 0);
    }

    /**
     * Sets the milestone on completed
     * @param e
     */
    const handleFinish = (e: any) => {
        e.stopPropagation();
        const milestone = props.milestone;
        milestone.IsCompleted = !milestone.IsCompleted;
        props.updateMilestone(milestone.Id, milestone);
    }

    /**
     * Hides the milestone details view in overview
     * @param id
     */
    const handleCancel = (id: string) => {
        setShowMilestone(false);
    }

    return (
        <>
        {
            showMilestone
                    ?
                    <MilestoneViewComponent _URL={props._URL} reloadProjects={props.reloadProjects} key={props.milestone.Id} updateMemebrList={updateMemebrList} id={props.milestone.Id} projectReference={props.project.Id} name={props.milestone.Name} description={props.milestone.Description} start={props.milestone.Start} end={props.milestone.End} isCompleted={props.milestone.IsCompleted} milestoneMembers={props.milestone.Members.filter(m => m !== null)} members={props.members} color={RandomColor.get()} handleCancel={handleCancel} showMilestone={handleClick} updateMilestone={props.updateMilestone} deleteMilestone={props.deleteMilestone} />
            :
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone" style={{ backgroundColor: props.color }} title={('Members:\n' + Array.from(updatedMemberList).map((member, index) => (index + 1) + '- ' + member.Firstname + ' ' + member.Lastname + '\n').toString().replaceAll(',', ''))} onClick={(e) => handleClick(e, props.milestone.Id)}>
                <p>{props.milestone.Name}</p>
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-details" title={'Start: ' + moment(props.milestone.Start).format("DD.MM.YYYY") + '\n' + 'End: ' + moment(props.milestone.End).format("DD.MM.YYYY")}>
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-details-value" style={{ color: (calculateRemaining(hourDiff, diffFromStartToNow) === 100 ? 'red' : 'black')}}>
                        {calculateRemaining(hourDiff, diffFromStartToNow) < 100 ? calculateRemaining(hourDiff, diffFromStartToNow) + '%' : 'expired'} 
                    </div>
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-details-progress" style={{ background: (props.milestone.IsCompleted || calculateRemaining(hourDiff, diffFromStartToNow) >= 80 ? LEVELS.VERY_IMPORTANT : (calculateRemaining(hourDiff, diffFromStartToNow) > 50 && calculateRemaining(hourDiff, diffFromStartToNow) > 0 ? LEVELS.IMPORTANT : LEVELS.NONSIGNIFICANT)), width: calculateRemaining(hourDiff, diffFromStartToNow) + '%' }}>
                </div>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-milestonesContainer-milestone-buttons">
                {!props.milestone.IsCompleted ? <button onClick={handleShift} title="Shift the milestone for one day">Shift</button> : ''}
                <button onClick={handleFinish} title="Milestone is complete?">{props.milestone.IsCompleted ? 'Open' : 'Complete'}</button>
            </div>
        </div>
            }
    </>
  );
} 