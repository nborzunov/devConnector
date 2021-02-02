import React, {Fragment, useState} from 'react';
import {Link, withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addEducation} from '../../actions/profile';

const AddEducation = ({addEducation, history }) => {
    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        current: false,
        to: '',
        description: ''
    });

    const[toDateDisabled, toggleDateDisabled] = useState(false);

    const { school, degree, fieldofstudy, from, to, current, description} = formData;

    const onChange = event => setFormData({...formData, [event.target.name]: event.target.value});

    const onSubmit = event => {
        event.preventDefault();
        addEducation(formData, history);
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Add your Education</h1>
            <p class="lead"><i class="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that you have attended</p>
            <small>* = required field</small>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                <input type="text" placeholder="* School or Bootcamp" name="school" value={school} onChange={e=>onChange(e)} />
                </div>
                <div className="form-group">
                <input type="text" placeholder="* Degree or Certificate" name="degree" value={degree} onChange={e=>onChange(e)} />
                </div>
                <div className="form-group">
                <input type="text" placeholder="* Field of Study" name="fieldofstudy" value={fieldofstudy} onChange={e=>onChange(e)}/>
                </div>
                <div className="form-group">
                <h4>From Date</h4>
                <input type="date" name="from" value={from} onChange={e=>onChange(e)}/>
                </div>
                <div className="form-group">
                <p><input type="checkbox" name="current" value={current} checked={current} onChange={e=>{
                    setFormData({...formData, current: !current });
                    toggleDateDisabled(!toDateDisabled);
                }} /> {' '}Current School</p>
                </div>
                <div className="form-group">
                <h4>To Date</h4>
                <input type="date" name="to" value={to} onChange={e=>onChange(e)} disabled={toDateDisabled ? 'disabled' : ''}/>
                </div>
                <div className="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Job Description"
                    value={description} 
                    onChange={e=>onChange(e)}
                ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to='/dashboard'>Go Back</Link>
            </form>
        </Fragment>
    )
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired,
}

export default connect(null, {addEducation})(withRouter(AddEducation))