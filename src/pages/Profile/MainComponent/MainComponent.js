import React, { Component } from 'react';
// import mainComponentStyles from './MainComponent.css';
import Treemap from '../../../components/Chart/Treemap/Treemap';
import ItemsList from '../ItemsList/ItemsList';

class MainComponent extends Component {
  state = {
    components: {
        table: ItemsList,
        chart: Treemap,
        noop: 'div'
    },
    chartData: {}
  };

  componentDidMount() {
    const { component } = this.props;
    if (component === 'chart') {
      this.setState({chartData: this.props.data});
    }

  }

  render() {
    const TagName = this.state.components[this.props.component];
    const { data, config, callbacks, className, component } = this.props;

    if (TagName !== 'div') {
      return (
        <div className={className}>
          <TagName data={data} config={config} callbacks={callbacks} />
        </div>
      )
    } else {
      return (<div>Loading....</div>)
    }

  }

};

export default MainComponent;
