import React from "react";

import GetResults from "./api";
import "./Highscores.css";

class Highscores extends React.Component {
  state = { results: [] };

  componentDidMount() {
    this.getRes();
  }

  async getRes() {
    let results = await GetResults.getResults();
    console.log(results);
    this.setState({results:results});
  }

  render() {
    console.log(this.state);

    let rank = 1;
    let content = this.state.results.map(
      value =>

        <tr className="row">
          <td className="cell">{rank++}.</td>
          <td className="cell">{value.name}</td>
          <td className="cell">{value.score}</td>
        </tr>
    );

    return (
      <div className="container">
        <h2 id="header"> HIGHSCORES: </h2>

        <table className="table">

          <thead>
            <tr className="header">
              <th>POSITION</th>
              <th>USERNAME</th>
              <th>SCORE</th>
            </tr>
            </thead>

            <tbody>
              {content}
            </tbody>

        </table>
      </div>
    );
  }
}

export default Highscores;
