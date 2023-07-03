import Milestone from '../../models/Milestone';
import Project from '../../models/Project';
import ProjectBlockComponent from './ProjectBlockComponent';

type GanttProps = {
    _URL:string,
    reloadProjects: () => void,
    projects: Project[],
    milestones: Milestone[],
    timeline: { from: Date, to: Date },
    subject: string,
    add: (newProject: Project) => void,
    delete: (id: string) => void,
    update: (id: string, updatedProject: Project) => void,
    updateMilestone: (id: string, updatedMilestone: Milestone) => void,
    get: (id: string) => void,
}

export default function OverviewTemplateComponent(props: GanttProps) {
    return (
        <div className="ganttContainer-ganttComponent">
            {props.projects.map((project, index) =>
                <div key={project.Id} className="ganttContainer-ganttComponent-projectContainer">
                    <div className="ganttContainer-ganttComponent-projectContainer-name">
                        {project.Name}
                    </div>
                    <ProjectBlockComponent _URL={props._URL} reloadProjects={props.reloadProjects} timeline={props.timeline} milestones={props.milestones} project={project} isEditing={false} add={props.add} delete={props.delete} update={props.update} get={props.get} />
                </div>
            )}
      </div>
  );
}