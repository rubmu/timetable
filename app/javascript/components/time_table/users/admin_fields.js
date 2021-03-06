import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import Autocomplete from 'react-autocomplete';
import { makeGetRequest } from '../../shared/api';


function AdminFields(props) {
  const {
    user,
    errors,
    onChange,
    setUser,
  } = props;

  const [availablePositions, setAvailablePositions] = useState([]);

  function getAvailablePositions() {
    makeGetRequest({ url: '/api/users/positions' })
      .then((response) => {
        const positions = response.data.map((position) => ({ label: position }));
        setAvailablePositions(positions);
      });
  }

  function setPosition(e) {
    setUser({ ...user, position_list: [e.target.value] });
  }

  function selectPosition(value) {
    setUser({ ...user, position_list: [value] });
  }

  useEffect(() => {
    getAvailablePositions();
  }, []);

  return (
    <div>
      <div className="form-group">
        {errors.email && <div className="error-description">{errors.email.join(', ')}</div>}
        <input
          className={`${errors.email ? 'error' : ''} form-control`}
          type="text"
          name="email"
          placeholder="Email"
          onChange={onChange}
          value={user.email || ''}
        />
      </div>

      <div className="form-group">
        {errors.firstName && <div className="error-description">{errors.firstName.join(', ')}</div>}
        <input
          className={`${errors.firstName ? 'error' : ''} form-control`}
          type="text"
          name="first_name"
          placeholder={I18n.t('apps.users.first_name')}
          onChange={onChange}
          value={user.first_name || ''}
        />
      </div>
      <div className="form-group">
        {errors.lastName && <div className="error-description">{errors.lastName.join(', ')}</div>}
        <input
          className={`${errors.lastName ? 'error' : ''} form-control`}
          type="text"
          name="last_name"
          placeholder={I18n.t('apps.users.last_name')}
          value={user.last_name || ''}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        {errors.contract_name && <div className="error-description">{errors.contract_name.join(', ')}</div>}
        <input
          className={`${errors.contract_name ? 'error' : ''}form-control`}
          type="text"
          name="contract_name"
          placeholder={I18n.t('apps.users.contract_id')}
          value={user.contract_name || ''}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        {errors.phone && <div className="error-description">{errors.phone.join(', ')}</div>}
        <input
          className={`${errors.phone ? 'error' : ''} form-control`}
          type="text"
          name="phone"
          placeholder={I18n.t('apps.users.phone')}
          value={user.phone || ''}
          onChange={onChange}
        />
      </div>
      <div className="form-group">
        {errors.birthdate && <div className="error-description">{errors.birthdate.join(', ')}</div>}
        <input
          className={`${errors.birthdate ? 'error' : ''} form-control`}
          value={user.birthdate ? moment(user.birthdate).format('YYYY-MM-DD') : ''}
          type="date"
          name="birthdate"
          onChange={onChange}
        />
      </div>
      { user.id !== currentUser.id && (
        <div className="form-group">
          <label>
            {I18n.t('apps.users.user_active')}
            <input type="checkbox" name="active" checked={user.active || false} onChange={onChange} />
          </label>
        </div>
      )}
      { user.id === currentUser.id && (
        <div className="form-group">
          <NavLink className="btn btn-primary" to={`/users/${user.id}/external_authorization`}>{I18n.t('common.external_auth')}</NavLink>
        </div>
      )}
      <div className="form-group">
        <select className="form-control" name="lang" onChange={onChange} value={user.lang}>
          <option value="pl">pl</option>
          <option value="en">en</option>
        </select>
      </div>

      <div className="form-group">
        <Autocomplete
          inputProps={{ className: 'form-control', placeholder: I18n.t('apps.users.position') }}
          wrapperStyle={{ width: '100%' }}
          getItemValue={(item) => item.label}
          shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
          renderItem={(item, isHighlighted) => (
            <div key={item.label} style={{ background: isHighlighted ? 'lightgray' : 'white', padding: '10px' }}>
              {item.label}
            </div>
          )}
          name="position_list"
          items={availablePositions}
          value={user.position_list[0] || ''}
          onChange={setPosition}
          onSelect={selectPosition}
          menuStyle={{
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        />
      </div>
    </div>
  );
}

AdminFields.propTypes = {
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default AdminFields;
