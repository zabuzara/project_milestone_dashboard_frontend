import { Link, useLocation } from "react-router-dom"

/**
 * Controls the Routing in Header
 * */
export default function Router() {
    const location = useLocation().pathname.substring(1, useLocation().pathname.length);

    return (
        <div className="Router">
            <ul className="headerContainer-navigationContainer-items">
                <li className={"headerContainer-navigationContainer-items-item " + (location === 'overview' || location === '' ? 'active' : '')}>
                    <Link className="headerContainer-navigationContainer-items-item-link" to="overview">Projects</Link>
                </li>
                <li className={"headerContainer-navigationContainer-items-item " + (location === 'members' ? 'active' : '')}>
                    <Link className="headerContainer-navigationContainer-items-item-link" to="members">Members</Link>
                </li>
            </ul>
        </div>
    );
}