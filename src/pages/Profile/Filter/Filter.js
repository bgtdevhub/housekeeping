import React, { Component } from 'react';
import './Filter.css';

class Filter extends Component {
  handleOnChange = event => {
    const { callbacks } = this.props;
    const obj = JSON.parse(event.target.value);
    callbacks.onChange(obj.key, obj.item);
  };

  render() {
    const { data, config, callbacks } = this.props;

    return (
      <label className='app-filter'>
        {data.label}
        <select className='select-full' onChange={this.handleOnChange}>
          {data.items.map(item => (
            <option
              value={JSON.stringify({ item, key: data.type })}
              key={item.label}
            >
              {item.label}
            </option>
          ))}
        </select>
      </label>
    );
  }
}

export default Filter;
