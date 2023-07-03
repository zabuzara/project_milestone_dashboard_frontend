import OverviewService from '../services/OverviewService';

type OverviewProps = {
    URL:string,
    subject: string,
    timeline: {from:Date,to:Date} 
}

/**
 * Overview function for showing/editing/removing/adding/updating all project with the milestones
 * @param props
 */
export default function Overview(props: OverviewProps) {
    const url = {
        getAll: props.URL +'api/project/getall',
        getById: props.URL +'api/project/getbyid/',
        getByName: props.URL +'api/project/getbyname/',
        createProject: props.URL +'api/project/createproject',
        updateProject: props.URL +'api/project/updateproject/',
        deleteProject: props.URL +'api/project/deleteproject/',
    };
    const token: string = "";

    return (
        <OverviewService _URL={props.URL} URL={url} TOKEN={token} subject={props.subject} timeline={props.timeline} />
    );
} 