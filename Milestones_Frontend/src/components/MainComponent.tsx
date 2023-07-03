import React from 'react';
import { Routes, Route } from "react-router-dom"
import NotFound from './../pages/NotFound';
import Members from './../pages/Members';
import Overview from './../pages/Overview';

type MainProps = {
    URL:string,
    subject: string,
    timeline: {from:Date,to:Date}
}
/**
 * Inlcudes all sub components in MainComponent
 * */
export default class MainComponent extends React.Component<MainProps> {
    /**
     * Initializes a new instance
     * @param props
     */
    constructor(props: MainProps) {
        super(props);
    }

    render() { 
        return (
            <main className="mainContainer">
                <Routes>
                    <Route path="/" element={<Overview URL={this.props.URL} subject={this.props.subject} timeline={this.props.timeline} />}></Route>
                    <Route path="/overview" element={<Overview URL={this.props.URL} subject={this.props.subject} timeline={this.props.timeline} />}></Route>
                    <Route path="/members" element={<Members URL={this.props.URL} subject={this.props.subject} />}></Route>
                    <Route path="*" element={<NotFound />}></Route>
                </Routes>
            </main>
        );
    };
}