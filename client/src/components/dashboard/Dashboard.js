import React, {Fragment, useEffect} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const Dashboard = ({ getCurrentProfile, auth: {user}, profile: {profile, loading} }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);
    return loading && profile === null ? <Spinner/> : <Fragment>
        <h1 className='large text-primary'>Dashboard</h1>
        <p class="lead"><i class="fas fa-user"></i> Welcome { user && user.name }</p>
        {profile !== null ? 
            (<Fragment>
                <div class="dash-buttons">
                    <Link to="edit-profile.html" class="btn btn-light"><i class="fas fa-user-circle text-primary"></i> Edit Profile</Link>
                    <Link to="add-experience.html" class="btn btn-light"><i class="fab fa-black-tie text-primary"></i> Add Experience</Link>
                    <Link to="add-education.html" class="btn btn-light"><i class="fas fa-graduation-cap text-primary"></i> Add Education</Link>
                </div>
            </Fragment>) 
        : 
            (<Fragment>
                <p> You have not yet setup a profile, please add some info.</p>
                <Link to='/create-profile' className='btn btn-primary my-1'> Create Profile</Link>
            </Fragment>)}

    </Fragment>;
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
