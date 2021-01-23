import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from '../Containers/HomeScreen';
import LaunchScreen from '../Containers/LaunchScreen';
import LoginScreen from '../Containers/LoginScreen';
import SignUpScreen from '../Containers/SignUpScreen';
import {ScreenNameEnum} from '../Literals/Enums';

const mapNavigationStateParamsToProps = (SomeComponent: any) => {
  return class extends Component<any, any> {
    public static navigationOptions = SomeComponent.navigationOptions; // better use hoist-non-react-statics
    public render() {
      const {
        navigation: {
          state: {params},
        },
      } = this.props;
      return <SomeComponent {...params} {...this.props} />;
    }
  };
};

export const AppNavigation = createStackNavigator(
  {
    Home: {screen: HomeScreen},
  },
  {
    initialRouteName: ScreenNameEnum.Home,
  },
);

export const SwitchNavigation = createSwitchNavigator(
  {
    App: {screen: AppNavigation},
    Launcher: {screen: LaunchScreen},
    Login: {screen: mapNavigationStateParamsToProps(LoginScreen)},
    SignUp: {screen: SignUpScreen},
  },
  {
    initialRouteName: 'Launcher',
  },
);

export default createAppContainer(SwitchNavigation);
