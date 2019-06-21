import { Platform, StatusBar } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Main from './app/Main';
import Game from './app/Game';
import Leaderboard from './app/Leaderboard';

const App = createStackNavigator(
  {
    Main: {
      screen: Main
    },
    Game: {
      screen: Game
    },
    Leaderboard: {
      screen: Leaderboard
    }
  },
  {
    cardStyle: {
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
    }
  }
);

export default App;