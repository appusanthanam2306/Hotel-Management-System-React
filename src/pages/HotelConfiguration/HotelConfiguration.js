import React, { useState, useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import RoomType from './RoomTypes';
import Rooms from './Rooms';
import Floors from './Floors';
import Amenities from './Amenities';
import Dashboard from './Dashboard';
import DashboardService from '../../services/DashboardService';

function HotelConfiguration () {
  let { path, url } = useRouteMatch();
  const [ dashboardMetrics, setDashboardMetrics ] = useState([]);

  function getDashboardMetrics () {
    DashboardService.getHotelConfigurationMetrics()
      .then(({ data }) => {
        setDashboardMetrics(data)
      })
  }

  useEffect(() => {
    getDashboardMetrics();
  }, []);

  return (
    <div>
      <Dashboard dashboardMetrics={dashboardMetrics}/>
      <Switch>
        <Route exact path={`${path}/roomTypes`}>
          <RoomType getDashboardMetrics={getDashboardMetrics}/>
        </Route>
        <Route exact path={`${path}/rooms`}>
          <Rooms getDashboardMetrics={getDashboardMetrics}/>
        </Route>
        <Route exact path={`${path}/floors`}>
          <Floors getDashboardMetrics={getDashboardMetrics}/>
        </Route>
        <Route exact path={`${path}/amenities`}>
          <Amenities getDashboardMetrics={getDashboardMetrics}/>
        </Route>
      </Switch>
    </div>
  )
}

export default HotelConfiguration;