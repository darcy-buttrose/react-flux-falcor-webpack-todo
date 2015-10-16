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
            var jsonGraphArg2 = jsonGraphArg['todos'];
            console.log('todoRouter[set] => todosUpdate=' + JSON.stringify(jsonGraphArg2));

            var results = [];

            _.each(jsonGraphArg2,(todo,id) => {
                console.log('todoRouter[set return] => id=' + id);
                _.each(todo,(val,prop) => {
                    console.log('todoRouter[set return] => key=' + prop + ' value=' + val);
                    todos[id][prop] = val;
                    results.push({
                        path: ['todos',id,prop],
                        value: val
                    });
                });
            });
            console.log('todoRouter[set return] => ' + JSON.stringify(results));
            return results;
        }
    }
]);

export default class TodoRouter extends TodoRouterBase {
    constructor(){
        super();
   }
}