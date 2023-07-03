import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CancelButtonComponent from "../buttons/CancelButtonComponent";
import SaveButtonComponent from "../buttons/SaveButtonComponent";
import RandomColor from "../../tools/RandomColor";
import Project from "../../models/Project";
import moment from 'moment';

type ProjectTemplateProps = {
    id:string,
    isEditing: boolean,
    subject: string,
    timeline: { from: Date, to: Date },
    add: (newProject: Project) => void,
    delete: (id: string) => void,
};
/**
 * OvervieProjectTemplateComponent using for make a template for adding new project
 * @param props
 */
export default function OverviewProjectTemplateComponent(props: ProjectTemplateProps) {
    const location = useLocation().pathname.substring(1, useLocation().pathname.length);
    const nameRef: any = useRef(null);
    const startDateRef: any = useRef(null);
    const endDateRef: any = useRef(null);
    const [message, setMessage] = useState(''); 

    /**
     * Handles adding the new project
     * */
    const handleAdd = () => {
        if (nameRef.current.textContent.trim().length > 0) {
            const newProject = new Project();
            newProject.Name = nameRef.current.textContent.trim();
            newProject.Start = moment("03.11.1971 00:00:00").toISOString();
            newProject.End = moment("03.11.1971 23:59:59").toISOString();
            props.add(newProject);
        } else {
            if (nameRef.current.textContent.trim().length == 0) setMessage('Project name is empty');
            else if (startDateRef.current.value.length == 0) setMessage('Start date not set');
            else if (endDateRef.current.value.length == 0) setMessage('End date not set');
            nameRef.current.focus();
        }
    };

    useEffect(() => {
        nameRef?.current?.focus();
    }, []);

    return (
        <div className="ganttContainer-ganttComponent-projectComponent" key={props.id}>
            <div className="ganttContainer-ganttComponent-projectComponent-messageBox">
                <span className="ganttContainer-ganttComponent-projectComponent-messageBox-leftMessage">{message}</span>
            </div>
            <div className="ganttContainer-ganttComponent-projectComponent-projectContainer" style={{ backgroundColor: RandomColor.get() }}>
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-contentContainer">
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-contentContainer-title">
                        Project-Name 
                    </p>
                </div> 
                <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-contentContainer">
                    <p className="ganttContainer-ganttComponent-projectComponent-projectContainer-name edit" contentEditable suppressContentEditableWarning={true} ref={nameRef}>
                   
                    </p>
                </div>
                {(location === "overview" || location === "" )?
                    <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-contentContainer">
                        <div className="ganttContainer-ganttComponent-projectComponent-projectContainer-buttons">
                            <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-addButton" onClick={handleAdd}>
                                <SaveButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-addButton-icon' src={require('../../add-icon.png')} />
                            </button>
                            <button className="ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-cancelButton" onClick={() => props.delete(props.id)}>
                                <CancelButtonComponent class='ganttContainer-ganttComponent-projectComponent-projectContainer-buttons-cancelButton-icon' src={require('../../cancel-icon.png')} />
                            </button>
                        </div>
                    </div>
                    : ""
                    }
            </div>
        </div>
    );
}