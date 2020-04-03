import React from 'react';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import URI from 'urijs';
import * as Api from '../../shared/api';
import { displayDuration } from '../../shared/helpers';
import Popup from './popup';

const simpleDateFormat = (date) => moment(date).format('YYYY/MM/DD');
export default class NewGroupReport extends React.Component {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.state = {
      projectId: parseInt(this.props.match.params.projectId, 10),
      reports: [],
      from: '',
      to: '',
      showPopup: false,
      isChecked: false,
    };
  }

  componentDidMount() {
    this.getReports();
    const base = URI(window.location.href);
    const { from, to } = base.query(true);
    this.setState({ from, to });
  }

  newReportLink() {
    const { from, to, projectId } = this.state;
    return `/projects/${projectId}/new_report?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  }

  togglePopup = () => {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }

  handleChecked = () => {
    this.setState({ isChecked: !this.state.isChecked });
  }

  onDelete(e) {
    e.preventDefault();

    if (window.confirm(I18n.t('common.confirm'))) {
      Api.makeDeleteRequest({ url: e.currentTarget.href }).then((data) => {
        if (parseInt(data.status, 10) === 204) {
          this.getReports();
        }
      });
    }
  }

  getReports() {
    Api.makeGetRequest({ url: `/api/projects/${this.state.projectId}/project_reports` })
      .then(({ data }) => {
        this.setState({ reports: data });
      });
  }

  renderReportState(state) {
    const iconClass = ({
      done: 'fa-check',
      editing: 'fa-pencil',
    })[state] || 'fa-info-circle';
    return (
      <span className="report-status">
        <i className={`symbol fa ${iconClass}`} />
        {state}
      </span>
    );
  }

  render() {
    const { projectId, reports } = this.state;
    return (
      <div className="list-of-reports">
        <Helmet>
          <title>{I18n.t('common.reports')}</title>
        </Helmet>
        <p className="text-right">
          <button type="button" className="bt bt-main" onClick={this.togglePopup.bind(this)}>show popup</button>
        </p>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{I18n.t('common.name')}</th>
                <th className="text-center">{I18n.t('common.state')}</th>
                <th className="text-center">{I18n.t('common.range')}</th>
                <th className="text-center">{I18n.t('common.duration')}</th>
                <th className="text-center">{I18n.t('common.cost')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {reports.map(({
                id,
                name,
                state,
                starts_at,
                ends_at,
                generated,
                duration,
                cost,
                currency,
              }) => (
                <tr key={id}>
                  <td>
                    {name}
                  </td>
                  <td className="text-center">
                    {this.renderReportState(state)}
                  </td>
                  <td className="text-center">
                    {`${simpleDateFormat(starts_at)}-${simpleDateFormat(ends_at)}`}
                  </td>
                  <td className="text-center">
                    {displayDuration(duration)}
                  </td>
                  <td className="text-center">
                    {currency}
                    {' '}
                    {cost.toFixed(2)}
                  </td>
                  <td className="report-actions text-right">
                    {generated
                        && (
                          <a className="bt bt-second bt-download" href={`/api/projects/${projectId}/project_reports/${id}/file`}>
                            <i className="symbol fa fa-file-pdf-o" />
                            <span className="txt">{I18n.t('common.download')}</span>
                          </a>
                        )}
                    <a href={`/api/projects/${projectId}/project_reports/${id}`}>
                      <input type="checkbox" onChange={this.handleChecked} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {this.state.showPopup ? (
          <Popup
            text="Close Me"
            closePopup={this.togglePopup.bind(this)}
          />
        )
          : null}
      </div>
    );
  }
}
