import { useEffect, useState } from 'react';

type TimeMachineProps = {
    timeline: (from: Date, to: Date) => void;
}
/**
 * Timeline Functional-Componenet (without moment.js)
 * @param props
 */
export default function TimeMachineComponent(props: TimeMachineProps) {
    const [now, setNow] = useState(new Date(Date.now()));
    const [start, setStart] = useState(new Date(Date.parse('01-01-' + now.getFullYear())));
    const [end, setEnd] = useState(new Date(Date.parse('12-31-' + now.getFullYear() + ' 23:59:59')));
    const datetime = {
        day: parseInt(now.toLocaleString().split(', ')[0].split('.')[0]),
        month: parseInt(now.toLocaleString().split(', ')[0].split('.')[1]),
        year: parseInt(now.toLocaleString().split(', ')[0].split('.')[2]),
        hour: parseInt(now.toLocaleString().split(', ')[1].split(':')[0]),
        minute: parseInt(now.toLocaleString().split(', ')[1].split(':')[1]), 
        second: parseInt(now.toLocaleString().split(', ')[1].split(':')[2]),
    }
    const timeline = [
        'Today', 'Week', 'Month', 'Year', 'All'
    ]; 

    useEffect(() => {
        const week = getWeekInterval();
        props.timeline(week.from, week.to);
    }, []);  

    /**
     * Returns the start day and end day of current year
     * */
    function getYearInterval() {
        return { from: start, to: end };
    }

    /**
     * Returns the start day and end day of current month
     * */
    function getMonthInterval() {
        const currentMonthName = new Date(Date.parse(datetime.month + '-' + datetime.day + '-' + datetime.year)).toString().split(' ')[1];
        let startOfMonth = new Date(Date.parse(datetime.month + '-1-' + datetime.year));
        let endOfMonth = new Date();
        for (let monthIndex = datetime.month; monthIndex < 13; monthIndex++) {
            for (let dayIndex = datetime.day; dayIndex < 32; dayIndex++) {
                const monthName = new Date(Date.parse(monthIndex + '-' + dayIndex + '-' + datetime.year)).toString().split(' ')[1];
                if (currentMonthName === monthName)
                    endOfMonth = new Date(Date.parse(monthIndex + '-' + dayIndex + '-' + datetime.year + ' 23:59:59'));
            }
        }
        return { from:startOfMonth, to:endOfMonth }; 
    } 

    /**
     * Returns the start day and end day of current week
     * */
    function getWeekInterval() {  
        const currentMonth = getMonthInterval().to || '';
        const lastDay = parseInt(currentMonth.toLocaleString().split(', ')[0].split('.')[0]);
        let monthDigit = datetime.month;
        let dayDigit = datetime.day;
        let firstWorkDay = new Date();
        for (let dayIndex = dayDigit; dayIndex >= 1; dayIndex--) {
            const dayName = new Date(Date.parse(monthDigit + '-' + dayIndex + '-' + datetime.year)).toString().split(' ')[0];
            if (dayName === 'Mon') {
                firstWorkDay = new Date(Date.parse(monthDigit + '-' + dayIndex + '-' + datetime.year));
                break;
            }
            if (dayIndex === lastDay) {
                monthDigit--;
                dayIndex = dayDigit = 31;
            }
        }
        monthDigit = datetime.month;
        dayDigit = datetime.day;
        let lastWorkDay = new Date();
        for (let dayIndex = dayDigit; dayIndex <= lastDay; dayIndex++) {
            const dayName = new Date(Date.parse(monthDigit + '-' + dayIndex + '-' + datetime.year)).toString().split(' ')[0];
            if (dayName === 'Sun') {
                lastWorkDay = new Date(Date.parse(monthDigit + '-' + dayIndex + '-' + datetime.year + ' 23:59:59'));
                break;
            }
            if (dayIndex === lastDay) {
                monthDigit++;
                dayIndex = dayDigit = 0;
            } 
        }

        return { from:firstWorkDay, to:lastWorkDay };
    }

    /**
     * Returns the start time and end time of current day
     * */
    function getDayInterval() {
        return { from: new Date(Date.parse(datetime.month + '-' + datetime.day + '-' + datetime.year + ' 00:00:00')), to: new Date(Date.parse(datetime.month + '-' + datetime.day + '-' + datetime.year + ' 23:59:59')) };
    }

    /**
     * Returns the start time and end time of of all
     * */
    function getAllInterval() {
        return { from: new Date(Date.parse('11-03-1971 00:00:00')), to: new Date(Date.parse('12-31-' + (now.getFullYear() + 10) + ' 23:59:59')) };
    }

    /**
     * Handles the changing value of timeline input element type range
     * @param e
     */
    const handleChange = (e: any) => {
        switch (parseInt(e.target.value)) {
            case 0:
                const dayInterval = getDayInterval();
                props.timeline(dayInterval.from, dayInterval.to);
                break;
            case 1:
                const weekInterval = getWeekInterval();
                props.timeline(weekInterval.from, weekInterval.to);
                break;
            case 2:
                const monthInterval = getMonthInterval();
                props.timeline(monthInterval.from, monthInterval.to);
                break;
            case 3:
                const yearInterval = getYearInterval();
                props.timeline(yearInterval.from, yearInterval.to);
                break;
            case 4:
                const allInterval = getAllInterval();
                props.timeline(allInterval.from, allInterval.to);
                break;
            default:break;
        }
    }

    return (
        <div className="searchContainer-timemachineComponent-timelineContainer"> 
            <label className="searchContainer-timemachineComponent-timelineContainer-label" htmlFor="timeline">{timeline.map((t, i) => <span key={i}>{t}</span>)}</label>
            <input className="searchContainer-timemachineComponent-timelineContainer-range" id="timeline" type="range" min="0" max={timeline.length-1} step="1" defaultValue="1" onChange={handleChange} />
        </div>
  );
}