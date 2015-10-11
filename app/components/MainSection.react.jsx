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
      range: this.props.todos.length,
      todos: this.props.todos,
      filter: this.filters.all
    };
    console.log('mainSect:ctor => ' + JSON.stringify(this.state));
  }

  _changeFilter(filter){
    this.setState({
      filter : this.filters[filter]
    });
  }

  _updateState(props) {
    this.setState({
      range: props.todos.length,
      todos: props.todos
    });
  }

  componentDidMount() {
    console.log('mainSect:componentDidMount');
    this._updateState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('mainSect:componentWillReceiveProps');
    this._updateState(nextProps);
  }

  /**
   * @return {object}
   */
  render() {
    let todoList = this.state.todos
        .filter(x=>this.state.filter(x[1]))
        .map((todo,idx)=> {
          console.log('todo=> id:' + todo[0] + ' item:' + JSON.stringify(todo[1]));
          return (<TodoItem todoid={todo[0]} key={todo[0]} name={todo[1].name} done={todo[1].done} />)
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
  todos: React.PropTypes.array.isRequired
};

