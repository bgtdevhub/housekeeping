import React, { Component } from 'react';

class Filter extends Component {

  handleOnChange = (event) => {
    const { callbacks } = this.props;
    if (event.target.value === 'refresh') {
      callbacks.onChange(event.target.value);
    } else {
      const obj = JSON.parse(event.target.value);
      callbacks.onChange(obj.key, obj.item);
    }
  };

  render() {
    const { data, config, callbacks } = this.props;

    return (
      <label>
        {data.label}
        <select className="select-full" onChange={this.handleOnChange}>
          <option value={'refresh'} key={''}>Please select...</option>
          {data.items.map(item => <option value={JSON.stringify({item, key: data.type})} key={item.label}>{item.label}</option>)}
        </select>
      </label>
    );
  }

};

export default Filter;
