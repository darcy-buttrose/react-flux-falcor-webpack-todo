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
import TodoTextInput from './TodoTextInput.react';
import classNames from 'classnames';

export default class TodoItem extends React.Component {

  constructor(props) {
      super(props);
    this.state = {
      timestamp: props.timestamp,
      todoid: props.todoid,
      todo: {
        name: '',
        done: false
      },
      isEditing: props.isEditing || false
    }
  }

  _updateState(model) {
    model.get(`todos[${this.props.todoid}]["name","done"]`)
        .then((res) => {
          console.log('todo=> ' + JSON.stringify(res));
          let storeTodo = res.json.todos[this.props.todoid];
          let newTodo = {
            id: this.state.todoid,
            name: storeTodo.name,
            done: storeTodo.done
          }
          this.setState({
            timestamp: new Date().getTime(),
            todo: newTodo
          });
          console.log('state=> ' + JSON.stringify(this.state));
        })
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
    var todo = this.state.todo;

    var input;
    if (this.state.isEditing) {
      input =
        <TodoTextInput
          className="edit"
          onSave={this._onSave.bind(this)}
          value={todo.text}
        />;
    }

    // List items should get the class 'editing' when editing
    // and 'completed' when marked as completed.
    // Note that 'completed' is a classification while 'complete' is a state.
    // This differentiation between classification and state becomes important
    // in the naming of view actions toggleComplete() vs. destroyCompleted().
    return (
      <li
        className={classNames({
          'completed': todo.done,
          'editing': this.state.isEditing
        })}
        key={todo.id}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.done}
            onChange={this._onToggleComplete.bind(this)}
          />
          <label onDoubleClick={this._onDoubleClick.bind(this)}>
            {todo.name}
          </label>
          <button className="destroy" onClick={this._onDestroyClick.bind(this)} />
        </div>
        {input}
      </li>
    );
  };

  _onToggleComplete() {
    TodoActions.toggleComplete(this.state.todo);
  };

  _onDoubleClick() {
    this.setState({isEditing: true});
  };

  /**
   * Event handler called within TodoTextInput.
   * Defining this here allows TodoTextInput to be used in multiple places
   * in different ways.
   * @param  {string} text
   */
  _onSave(text) {
    TodoActions.updateText(this.state.todo.id, text);
    this.setState({isEditing: false});
  };

  _onDestroyClick() {
    TodoActions.destroy(this.state.todo.id);
  };

}
TodoItem.propTypes = {
  model: React.PropTypes.object.isRequired,
  todoid: React.PropTypes.object.isRequired
};