/**
 * Copyright (c) 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * This component operates as a "Controller-View".  It listens for changes in
 * the TodoStore and passes the new data to its children.
 */

import Footer from './Footer.react';
import Header from './Header.react';
import MainSection from './MainSection.react';
import React from 'react';
import TodoStore from '../stores/TodoStore';
import fjs from 'functional.js';

export default class TodoApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      todos: []
    }
  }

  _updateState() {
    let model = TodoStore.getModel();
    model.getValue("todos.length")
        .then(len => {
          console.log('len=' + len);
          this.setState({range:len})
          return len-1;
        })
        .then(range=>{
          model.get(`todos[0..${range}].['name','done']`)
            .then(res=>{
                console.log('get=> ' + JSON.stringify(res));
                this.setState({
                  todos: fjs.toArray(res.json.todos)
                });
              })
        })
  }

  componentDidMount() {
    TodoStore.addChangeListener(this._onChange.bind(this));
    this._updateState();
  };

  componentWillUnmount() {
    TodoStore.removeChangeListener(this._onChange);
  };

  /**
   * @return {object}
   */
  render() {
    console.log('todoApp:render');
    return (
      <div>
        <Header />
        <MainSection todos={this.state.todos}/>
        <Footer todos={this.state.todos} />
      </div>
    );
  };

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange() {
    this._updateState();
  };

}
