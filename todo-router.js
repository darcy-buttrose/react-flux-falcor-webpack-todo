/**
 * Created by Darcy on 13/10/2015.
 */
import falcor from 'falcor';
import jsonGraph from 'falcor-json-graph';
import router from 'falcor-router';
import _ from 'underscore';

var $ref = jsonGraph.ref;
var $error = jsonGraph.error;

var todos = [
    {
        name: 'get milk from corner store',
        done: false
    },
    {
        name: 'froth milk',
        done: false
    },
    {
        name: 'make coffee',
        done: false
    }
];

const TodoRouterBase = router.createClass([{
        route: "todos.length",
        get: () => {
            return {path: ["todos","length"], value: todos.length};
        }
    },
    {
        route: "todos[{integers:ids}].['name','done']",
        get: (pathSet) => {
            var results = [];

            pathSet.ids.forEach((id) => {
                console.log('todoRouter[get] => id=' + id);
                var task = todos[id];
               pathSet[2].forEach((key) => {
                    results.push({
                        path: ['todos',id,key],
                        value: todos[id][key]
                    });
                });
            });

            return results;
        },
        set: (jsonGraphArg) => {

            console.log('todoRouter[set] => ' + JSON.stringify(jsonGraphArg));
            console.log('todoRouter[set] => todosUpdate=' + JSON.stringify(jsonGraphArg['todos']));

            return _.map(jsonGraphArg['todos'],(todo,id) => {
                console.log('todoRouter[set return] => id=' + id);
                return _.map(todo,(val,prop) => {
                    console.log('todoRouter[set return] => key=' + prop + ' value=' + val);
                    todos[id][prop] = val;
                    return {
                        path: ['todos',id,prop],
                        value: val
                    };
                });
            });
        }
    }
]);

export default class TodoRouter extends TodoRouterBase {
    constructor(){
        super();
   }
}