import React from 'react';
import Router from '../Router';
import SearchComponent from './search/SearchComponent';

type HeaderProps = {
    search: (subject: string) => void,
    timeline: (from: Date, to: Date) => void,
}
/**
 * Includes all sub components in HeaderComponent
 * */
export default class HeaderComponent extends React.Component<HeaderProps> {
    /**
     * Initializes a new instance
     * @param props
     */
    constructor(props: HeaderProps) {
        super(props);
    }

    render() {
        return (
            <header className="headerContainer">
                <div className="headerContainer-logoContainer">
                    <figure className="headerContainer-logoContainer-logoFrame">
                        <img className="headerContainer-logoContainer-logoFrame-logoImage" alt="logo" src={require('../logo.png')} />
                    </figure>
                </div>
                <div className="headerContainer-titlesContainer">
                    <div className="headerContainer-titlesContainer-titles">
                        <h1>Milestones-WEB</h1>
                        <h4>A little web application for organize the milestones</h4>
                    </div>
                </div>
                <div className="headerContainer-navigationContainer">
                    <Router/>
                </div>
                <SearchComponent component={null} params={['department']} search={this.props.search} timeline={this.props.timeline}/>
            </header>    
        );
    };
}