/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React from 'react';
import TodoActions from '../actions/TodoActions';
import fjs from 'functional.js';

export default class Footer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          timestamp: props.timestamp,
          todos: [],
            total : 0
        }
    }

  _updateState(model) {
    model.getValue("todos.length")
        .then(len => {
          this.setState({total:len})
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
    var allTodos = fjs.toArray(this.state.todos);
    var total = this.state.total;

    if (total === 0) {
      return null;
    }

    var completed = allTodos.reduce((prev,curr)=>{if (curr.done){prev++} return prev;},0);

    var itemsLeft = total - completed;
    var itemsLeftPhrase = itemsLeft === 1 ? ' item ' : ' items ';
    itemsLeftPhrase += 'left';

    // Undefined and thus not rendered if no completed items are left.
    var clearCompletedButton;
    if (completed) {
      clearCompletedButton =
        <button
          id="clear-completed"
          onClick={this._onClearCompletedClick.bind(this)}>
          Clear completed ({completed})
        </button>;
    }

  	return (
      <footer id="footer">
        <span id="todo-count">
          <strong>
            {itemsLeft}
          </strong>
          {itemsLeftPhrase}
        </span>
        {clearCompletedButton}
      </footer>
    );
  };

  /**
   * Event handler to delete all completed TODOs
   */
  _onClearCompletedClick() {
    TodoActions.destroyCompleted();
  };
}
Footer.propTypes = {
  model: React.PropTypes.object.isRequired
};
