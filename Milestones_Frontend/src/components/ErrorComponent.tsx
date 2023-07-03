import React from 'react';

type ErrorProps = {
    content:string
}
/**
 * Functional-Component for loading with error 
 * @param props
 */
export default function ErrorComponent(props:ErrorProps) {
    const Error = () => {
        const errorInnerBall = React.createElement('div', { className: 'errorComponent-outerRing-middleRing-innerRing-innerCircle' });
        const errorInnerRing = React.createElement('div', { className: 'errorComponent-outerRing-middleRing-innerRing' }, errorInnerBall);
        const errorMiddleRing = React.createElement('div', { className: 'errorComponent-outerRing-middleRing' }, errorInnerRing);
        const errorOuterRing = React.createElement('div', { className: 'errorComponent-outerRing' }, errorMiddleRing); 
        const errorText = React.createElement('p', { className: 'errorComponent-errorText' }, props.content); 
        const errorElement = React.createElement('div', { className: 'errorComponent' }, errorOuterRing, errorText);
        return errorElement;
    }; 

    return (
        <Error />
    );
}