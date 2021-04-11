import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Guests from './pages/Guests';
import BookedRooms from './pages/BookedRooms';
import HotelConfiguration from './pages/HotelConfiguration/HotelConfiguration';
import orange from '@material-ui/core/colors/orange';

const theme = createMuiTheme({
  typography: {
    fontFamily: "'Quicksand', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
  palette: {
    primary: {
      main: '#051e34',
      light: '#09365d',
      dark: '#051b2e'
    },
    secondary: {
      main: '#26c6da'
    },
    grey: {
      'A400': '#607D8B'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/">
              <Bookings bookingsType="current"/>
            </Route>
            <Route key="past-bookings" exact path="/bookings/pastBookings">
              <Bookings bookingsType="past"/>
            </Route>
            <Route key="future-bookings" exact path="/bookings/futureBookings">
              <Bookings bookingsType="future"/>
            </Route>
            <Route key="current-bookings" exact path="/bookings">
              <Bookings bookingsType="current" />
            </Route>
            <Route exact path="/guests">
              <Guests />
            </Route>
            {/* <Route exact path="/bookedRooms">
              <BookedRooms />
            </Route> */}
            <Route path="/hotelConfiguration">
              <HotelConfiguration />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
