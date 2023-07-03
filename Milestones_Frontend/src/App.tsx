import { useState } from 'react';
import './App.scss';
import HeaderComponent from './components/HeaderComponent';
import MainComponent from './components/MainComponent';

export default function App() {
    const [subject, setSubject] = useState('');
    const [timelineObject, setTimelineObject] = useState({ from: new Date(), to: new Date() });
    const URL_HOSTED = 'http://10.12.1.28:5000/';
    const URL_LOCAL = 'https://localhost:44349/'; 

    /**
     * Sets the subject in child components from search bar component 
     * @param subj
     */
    const search = (subj: string) => {
        setSubject(subj);
    };

    /**
     * Handles the timeline and sets it after changing
     * @param from
     * @param to
     */
    const timeline = (from: Date, to: Date) => {
        setTimelineObject({ from: from, to: to });
    };

    return (
        <div className="App">
            <HeaderComponent search={search} timeline={timeline}/>
            <MainComponent URL={URL_HOSTED}  subject={subject} timeline={timelineObject} />
        </div>
    );
}