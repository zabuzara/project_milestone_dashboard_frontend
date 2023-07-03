import { useEffect, useState } from 'react';
import LoadingComponent from '../components/LoadingComponent';
import ErrorComponent from '../components/ErrorComponent';
import OverviewComponent from '../components/overview/OverviewComponent';
import OverviewProjectTemplateComponent from '../components/overview/OverviewProjectTemplateComponent';
import Project from '../models/Project';

type OverviewProps = {
    _URL: string,
    URL: {
        getAll: string,
        getById: string,
        getByName: string,
        createProject: string,
        updateProject: string,
        deleteProject: string,
    },
    TOKEN: string,
    subject: string,
    timeline: { from: Date, to: Date },
}
/**
 * OverviewService for CRUD operations
 * @param props
 */
export default function OverviewService(props: OverviewProps) {
    const [status, setStatus] = useState("loading...");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [count, setCount] = useState(0);
    const [addEnabled, setAddEnaled] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [errorMessage, setErrorMessage] = useState('error...');
    const [message, setMessage] = useState('');
    const messageShowingTime = 5000;

    useEffect(() => {
        getProjects();
    }, [props.timeline]);

    const removeMessage = () => setMessage('');

    /**
     * Adds a new Project
     * @param newProject
     */
    const addProject = (newProject: Project) => {
        setStatus('creating...');
        setLoading(true);
        fetch(props.URL.createProject, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + props.TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProject)
        })
            .then((response) => response.json())
            .then(result => {
                if (result.success !== false)
                    setProjects([...projects, result]);

                setMessage("Project Created");
            })
            .then(() => setSuccess(true))
            .then(() => setAddEnaled(false))
            .then(() => setCount(0))
            .catch(() => setError(true));

        setTimeout(removeMessage, messageShowingTime);
    };

    /**
     * Removes the porject of given id
     * @param id
     */
    const deleteProject = (id: string) => {
        if (id === "project-template") {
            setCount(0);
            setAddEnaled(false);
            return;
        }
        setStatus('deleting...');
        setLoading(true);
        fetch(props.URL.deleteProject + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + props.TOKEN,
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then(result => {
                setProjects(projects.filter(project => project.Id !== id));
                setMessage(result.message);
            })
            .then(() => setSuccess(true))
            .catch(() => setError(true));

        setTimeout(removeMessage, messageShowingTime);
    };

    /**
     * Updates the project of given id and project object
     * @param id
     * @param updatedProject
     */
    const updateProject = (id: string, updatedProject: Project) => {
        setStatus('updating...');
        setLoading(true);
        fetch(props.URL.updateProject + id, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + props.TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProject)
        })
            .then((response) => response.json())
            .then(result => {
                setProjects(projects.map(project => project.Id === id ? updatedProject : project));
                setMessage(result.message);
            })
            .then(() => setSuccess(true))
            .catch(() => setError(true));

        setTimeout(removeMessage, messageShowingTime);
    };

    /**
     * Returns the project of given id
     * @param id
     */
    const getProject = (id: string) => {
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
            .then(project => setProjects(project))
            .then(() => setSuccess(true))
            .catch(() => setError(true));
    };

    /**
     * Returns all projects
     * */
    const getProjects = () => {
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
            .then(projects => setProjects(projects))
            .then(() => setSuccess(true))
            .catch(() => setError(true));
    };


    const reload = () => {
        setSuccess(false);
        setTimeout(getProjects, 500);
    }


    return (
        <div className="ganttContainer">
            <div className="ganttContainer-crudMessage">{message}</div>
            {
                !error && success && count < 1 ?
                    <input className="ganttContainer-addNew" type="button" onClick={() => { setCount(count + 1); setAddEnaled(true); }} value="+" /> 
                    : ""
            }
            {addEnabled && <OverviewProjectTemplateComponent key="project-template" id="project-template" subject={props.subject} timeline={props.timeline} isEditing={false} add={addProject} delete={deleteProject} />}
            {!success && loading && !error && <LoadingComponent content={status} />} 
            {!success && error && <ErrorComponent content={errorMessage} />}
            {success && projects.length > 0 ? <OverviewComponent _URL={props._URL} reloadProjects={reload} subject={props.subject} timeline={props.timeline} projects={projects} add={addProject} delete={deleteProject} update={updateProject} get={getProject} /> : ''}
        </div>
    );
}