import React from "react";
import { Router, Switch } from "react-router-dom";
import { Dashboard } from "./src/Components/";

const dashboardRoute = () => {
  return (
    <Route exact path="/dashboard">
      <Dashboard/>
    </Route>
  );
};

export {
  dashboardRoute
}
