import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TimeMachineComponent from './TimeMachineComponent';

type SearchProps = {
    component: any,
    params: string[],
    search: (content: string) => void,
    timeline: (from: Date, tp: Date) => void,
}

/**
 * Search Functional-Component
 * @param props
 */
export default function SearchComponent(props: SearchProps) {
    const location = useLocation().pathname.substring(1, useLocation().pathname.length);
    const inputRefs: any = new Array(props.params.length).fill(useRef(null));
    const states = new Map(props.params.map(key => [key, useState('')]));
    const [targetValue, setTargetValue] = useState('');

    /**
     * Handles teh subject change in Search bar
     * @param e
     * @param p
     */
    const handleChange = (e:any, p: string) => {
        states.get(p)?.[1](e.target.value);
        setTargetValue(e.target.value);
        props.search(e.target.value);
    }

    /**
     * Handles the timeline range element 
     * @param from
     * @param to
     */
    const handleTimeline = (from: Date, to: Date) => {
        props.timeline(from, to);
    }

    return (
        <div className="searchContainer">
            <div className="searchContainer-searchComponent">
                {props.params.map((p, index) => <input className="searchContainer-searchComponent-field" key={index} name={p} type="text" placeholder={'Search...'} value={states.get(p)?.[0]} onChange={(e) => handleChange(e, p)} ref={inputRefs[index]} />)}
            </div>
            {location === 'overview' || location === ''
                ?
                <div className="searchContainer-timemachineComponent">
                    <TimeMachineComponent timeline={handleTimeline } />
                </div>
                :
                ''
            }
        </div>
    );
}