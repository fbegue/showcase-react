import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Sidebar from './Sidebar';
import TodoDetail from './TodoDetail';
import brace from 'brace';
import AceEditor from 'react-ace';
import ContainerDimensions from 'react-container-dimensions';
import useAsync from './useAsync';
import { useDB, useNormalizedApi } from './db'

import 'brace/mode/json';
import 'brace/theme/monokai';

const drawerWidth = 360;

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  appBar: {

  },
  toolbar: theme.mixins.toolbar,
  contentAndToolbar: {
    flex: 3,
    minWidth: 320,
    boxSizing: 'border-box'
  },
  content: {
    padding: theme.spacing.unit * 3,
    height: 'calc(100vh - 64px)',
    boxSizing: 'border-box',
  },
  storeInspectors: {
    height: '70%',
    display: 'flex',
    justifyContent: 'space-between',
    overflowX: 'auto'
  },
  storeInspector: {
    flex: 1,
    margin: 8,
    boxSizing: 'border-box'
  },
  storeInspectorHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#252620',
    color: 'rgba(255, 255, 255, .8)',
    height: 48
  },
  todoDetail: {
    height: 170
  }
});

const filterQueries = {
  'active': 'ACTIVE_TODOS',
  'all': 'ALL_TODOS',
  'completed': 'COMPLETED_TODOS'
}

//==================================================
//HTTP attempt with hooks
//https://blog.bitsrc.io/making-api-calls-with-react-hooks-748ebfc7de8c

// import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
//
// import "./styles.css";

function GithubCommit() {
  const [page, setPage] = useState(1);
  const [commitHistory, setCommitHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMoreCommit = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    fetch(
      // `https://api.github.com/search/commits?q=repo:facebook/react+css&page=${page}`,
      'http://localhost:8888/getUserPlaylists',
      {
        method: "POST",
        // mode: "no-cors"
        // headers: new Headers({
        //   Accept: "application/vnd.github.cloak-preview"
        // })
      }
    )
      .then(res => res.json())
      .then(response => {
        console.log("$test============");
        console.log(response);
        // setCommitHistory(response.items);
        // setIsLoading(false);
      })
      .catch(error => console.log(error));
  }, [page]);

  return (
    <div>
      <h1> API calls with React Hooks </h1>
      {isLoading && <p>Wait I'm Loading comments for you</p>}

      {commitHistory.length !== 0 && (
        <button onClick={loadMoreCommit}>Load More Commits</button>
      )}

      {commitHistory.map((c, index) => (
        <div key={index}>
          {c.commit && (
              <div>
                <h2 style={{ textDecoration: "Underline" }}>
                  {c.commit.committer.name}
                </h2>
                <p>{c.commit.message}</p>
              </div>
          )}
        </div>
      ))}
    </div>
  );
}

function App(props) {
  const { classes } = props;
  let [filter, setFilter] = useState('active');
  let [selectedTodoId, setSelectedTodoId] = useState();

  let normalizedApi = useNormalizedApi()
  let db = useDB();

  let [fetchTodosRequest, fetchTodos] = useAsync(normalizedApi.fetchTodos)

  useEffect(() => {
    fetchTodos(filter)
  }, [filter])

  let todos = db.executeStoredQuery(filterQueries[filter]);
  let todoIds = JSON.stringify(todos.map(t => t.id))

  useEffect(() => {
    setSelectedTodoId(todos[0] && todos[0].id)
  }, [todoIds])

  return (
    <div className={classes.root}>

      <GithubCommit />
      <Sidebar
        todos={todos}
        fetchTodosRequest={fetchTodosRequest}
        filter={filter}
        onFilterChange={setFilter}
        selectedTodo={selectedTodoId}
        onSelectedTodoChange={setSelectedTodoId}
      />
      <div className={classes.contentAndToolbar}>
        <AppBar position="relative" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Todo App
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={classes.content}>
          <div className={classes.todoDetail}>
            <TodoDetail id={selectedTodoId}/>
          </div>
          <div className={classes.storeInspectors}>
            <div className={classes.storeInspector}>
            <ContainerDimensions>
                { ({ height, width }) => (
                    <React.Fragment>
                      <div className={classes.storeInspectorHeader}>
                        Entity Store
                      </div>
                      <AceEditor
                        value={JSON.stringify(db.entities, 2, 2)}
                        mode="json"
                        theme="monokai"
                        width={width}
                        height={320}
                        readOnly
                        name="entities-json"
                        editorProps={{$blockScrolling: true}}
                      />
                    </React.Fragment>
                ) }
            </ContainerDimensions>
            </div>
            <div className={classes.storeInspector}>
              <ContainerDimensions>
                  { ({ height, width }) => (
                    <React.Fragment>
                      <div className={classes.storeInspectorHeader}>
                        Query Store
                      </div>
                      <AceEditor
                        value={JSON.stringify(db.storedQueries, 2, 2)}
                        mode="json"
                        theme="monokai"
                        width={width}
                        height={320}
                        readOnly
                        name="stored-queries-json"
                        editorProps={{$blockScrolling: true}}
                      />
                    </React.Fragment>
                  ) }
              </ContainerDimensions>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
