/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from 'react';
import TodoActions from '../actions/TodoActions';
import TodoItem from './TodoItem.react';
import fjs from 'functional.js';

export default class MainSection extends React.Component {

  constructor(props) {
    super(props);
    this.filters = {
      all: x=>true,
      completed: x=>x.done,
      active: x=>!x.done
    };
    this.state = {
      timestamp: props.timestamp,
      range: 0,
      todos: [],
      filter: this.filters.all
    };
  }

  _changeFilter(filter){
    this.setState({
      filter : this.filters[filter]
    });
  }

  _updateState(model) {
    model.getValue("todos.length")
        .then(len => {
          this.setState({range:len})
          return len-1;
        }).then(range=>model.get(`todos[0..${range}].done`))
        .then(res=>this.setState({
          timestamp: new Date().getTime(),
          todos: res.json.todos
        }))
  }

  componentDidMount() {
    this._updateState(this.props.model);
  }

  componentWillReceiveProps(nextProps) {
    this._updateState(nextProps.model);
  }

  /**
   * @return {object}
   */
  render() {
    let todoList = fjs.toArray(this.state.todos)
        .filter(x=>this.state.filter(x[1]))
        .map((todo,idx)=> {
          console.log('todo=> id:' + todo[0] + ' item:' + JSON.stringify(todo[1]));
          return (<TodoItem todoid={todo[0]} key={todo[0]} model={this.props.model} timestamp={this.state.timestamp}/>)
        })

    return (
      <section id="main">
        <ul id="todo-list">{todoList}</ul>
      </section>
    );
  };

  /**
   * Event handler to mark all TODOs as complete
   */
  _onToggleCompleteAll() {
    TodoActions.toggleCompleteAll();
  };
}
MainSection.propTypes = {
  model: React.PropTypes.object.isRequired
};

