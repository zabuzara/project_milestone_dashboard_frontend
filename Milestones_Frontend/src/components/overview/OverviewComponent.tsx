import ProjectBlockComponent from './ProjectBlockComponent';
import Project from '../../models/Project';
import RandomColor from '../../tools/RandomColor';
import moment from 'moment';
import Milestone from '../../models/Milestone';
import { useEffect } from 'react';

type OverviewProps = {
    _URL:string,
    reloadProjects:()=>void,
    projects: Project[],
    timeline: { from: Date, to: Date },
    subject: string,
    add: (newProject: Project) => void,
    delete: (id: string) => void,
    update: (id: string, updatedProject: Project) => void,
    get: (id: string) => void,
}
/**
 * OverviewComponent for showing projects if subject existing
 * @param props
 */
export default function OverviewComponent(props: OverviewProps) {
    -
        useEffect(() => {
        }, [props.timeline, props.reloadProjects]);

    /**
 * Updates the project start date in project component in overview
 * */
    function updateProjectStartDate(milestones: Milestone[]) {
        return moment(milestones.length > 0 ? Array.from(milestones).map(milestone => moment(milestone.Start)).sort((a, b) => a.toDate() < b.toDate() ? -1 : 1)[0] : moment().format("11.03.1971"));
    }

    /**
     * Updates the project end date in project component in overview
     * */
    function updateProjectEndDate(milestones: Milestone[]) {
        return moment(milestones.length > 0 ? Array.from(milestones).map(milestone => moment(milestone.End)).sort((a, b) => a.toDate() > b.toDate() ? -1 : 1)[0] : moment().format("11.03.1971"));
    }

    return ( 
        <div className="ganttContainer-ganttComponent">
            {
                props.projects
                    .filter(p => p !== null && (props.subject.trim().length > 0 ? p.Milestones.filter(m => (m !== null && m.Name.toLowerCase().indexOf(props.subject.toLowerCase()) > -1)).length > 0 : true))
                    .filter(p => (updateProjectStartDate(p.Milestones).diff(moment("03.11.1971")) == 0 && updateProjectEndDate(p.Milestones).diff(moment("03.11.1971"))) == 0 && ((updateProjectStartDate(p.Milestones) >= moment(props.timeline.from) && updateProjectEndDate(p.Milestones) >= moment(props.timeline.from) && (updateProjectEndDate(p.Milestones) <= moment(props.timeline.to) || updateProjectStartDate(p.Milestones) <= moment(props.timeline.to)))))
                    .sort((p1, p2) => p1.End < p2.End ? -1 : 0)
                    .map((project, index) =>
                        <div key={project.Id} className="ganttContainer-ganttComponent-projectComponent" style={{ backgroundColor: RandomColor.get() }}>
                            <ProjectBlockComponent _URL={props._URL} reloadProjects={props.reloadProjects} timeline={props.timeline} milestones={project.Milestones} project={project} isEditing={false} add={props.add} delete={props.delete} update={props.update} get={props.get} />
                    </div>
                )
            }
      </div>
  );
}