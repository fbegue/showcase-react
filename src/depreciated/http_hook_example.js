//==================================================
//HTTP attempt with hooks
//https://blog.bitsrc.io/making-api-calls-with-react-hooks-748ebfc7de8c

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

//put into app.js
//<GithubCommit />

function GithubCommit() {
  const [page, setPage] = useState(1);
  const [commitHistory, setCommitHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMoreCommit = () => {
    setPage(page + 1);
  };

  //every time the component renders, we will call useEffect

  var fakeFetch = function(){
      return new Promise(function(done, fail) {
        done(getUserPlaylists)
      })
  };

  useEffect(() => {
    // fetch(
    //   // `https://api.github.com/search/commits?q=repo:facebook/react+css&page=${page}`,
    //   'http://localhost:8888/getUserPlaylists',
    //   {
    //     method: "POST",
    //     // mode: "no-cors"
    //     // headers: new Headers({
    //     //   Accept: "application/vnd.github.cloak-preview"
    //     // })
    //   }
    // )
    fakeFetch()
      // .then(res => res.json())
      .then(response => {
        console.warn("using fake data");
        response = getUserPlaylists;
        console.log(response);
        setCommitHistory(response.items);
        setIsLoading(false);
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
          {c.name && (
              <div>
                <h2 style={{ textDecoration: "Underline" }}>
                  {c.name}
                  ({c.tracks.total})
                </h2>
                <p>{c.owner.display_name}</p>
              </div>
          )}
        </div>
      ))}
    </div>
  );
}