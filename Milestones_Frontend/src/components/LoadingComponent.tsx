import React from 'react';

type LoadingProps = {
    content:string
}

/**
 * Functional-Component for loading 
 * @param props
 */
export default function LoadingComponent(props:LoadingProps) {
    const Loading = () => {
        const loadinginnerBall = React.createElement('div', { className: 'loadingComponent-outerRing-middleRing-innerRing-innerCircle' });
        const loadingInnerRing = React.createElement('div', { className: 'loadingComponent-outerRing-middleRing-innerRing' }, loadinginnerBall);
        const loadingMiddleRing = React.createElement('div', { className: 'loadingComponent-outerRing-middleRing' }, loadingInnerRing);
        const loadingOuterRing = React.createElement('div', { className: 'loadingComponent-outerRing' }, loadingMiddleRing); 
        const loadingText = React.createElement('p', { className: 'loadingComponent-loadingText' }, props.content); 
        const loadingElement = React.createElement('div', { className: 'loadingComponent' }, loadingOuterRing, loadingText);
        return loadingElement;
    }; 

    return (
        <Loading/>
    );
}