import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { bindActions } from './../util';
import reduce from './../reducers';
import * as actions from './../actions';

import fetchApi from './../utils/fetchApi';

@connect(reduce, bindActions(actions))
export default class Modal extends Component {

  shouldComponentUpdate({ modal, network }) {
    return modal !== this.props.modal || network !== this.props.network;
  }

  getLocation = (e) => {
    e.preventDefault();
    const value = this.input.value.toLowerCase();
    const exists = this.props.locations.filter(i => i.name.toLowerCase() === value).length !== 0;
    if (exists || value === '') {
      this.input.classList.add('error');
      this.input.value = '';
    } else {
      this.toggleModal();
      fetchApi('locations', { location: this.input.value }, (data) => {
        if (typeof data.warning === 'undefined') {
          this.input.classList.remove('error');
          this.input.value = '';
          this.props.addLocation(data);
        }
      });
    }
  }

  toggleModal = () => {
    if (!this.props.modal) {
      setTimeout(this.focus, 0);
    }
    this.props.setModal(!this.props.modal);
  };

  focus = () => {
    this.input.focus();
  }

  render({ modal, network }) {
    return (
      <div id="modal">
        <div id="background" className={modal && network ? 'visible' : ''} onClick={this.toggleModal} />
        <div id="overlay" className={modal && network ? 'opened' : ''}>
          <div className="layout-horizontal">
            <div className="label">Add a new location</div>
          </div>
          <form action="" className="layout-vertical">
            <input type="text" name="url" placeholder="Location..." ref={(input) => { this.input = input; }} />
            <div className="layout-horizontal">
              <input type="submit" className="modal-button" onClick={this.getLocation} value="Save" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}
