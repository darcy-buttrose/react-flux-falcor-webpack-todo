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

export default class Footer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allTodos : props.allTodos,
            total : Object.keys(props.allTodos).length
        }
    }
  /**
   * @return {object}
   */
  render() {
    var allTodos = this.state.allTodos;
    var total = this.state.total;

    if (total === 0) {
      return null;
    }

    var completed = 0;
    for (var key in allTodos) {
      if (allTodos[key].complete) {
        completed++;
      }
    }

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
  allTodos: React.PropTypes.object.isRequired
};
