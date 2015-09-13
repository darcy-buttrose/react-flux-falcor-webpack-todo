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
      todo: props.todo,
      isEditing: props.isEditing || false
    }
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
          'completed': todo.complete,
          'editing': this.state.isEditing
        })}
        key={todo.id}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.complete}
            onChange={this._onToggleComplete.bind(this)}
          />
          <label onDoubleClick={this._onDoubleClick.bind(this)}>
            {todo.text}
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
  todo: React.PropTypes.object.isRequired
};