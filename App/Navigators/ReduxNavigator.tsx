import React from 'react';
import {BackHandler} from 'react-native';
import ReactNavigation from 'react-navigation';
import {ReducerState} from 'react-navigation-redux-helpers';
import {connect} from 'react-redux';
import {IReducers} from '../Redux';
import AppNavigation from './AppNavigator';

interface IReduxNavigationProps {
  dispatch: any;
  nav: ReducerState;
}
class ReduxNavigation extends React.Component<IReduxNavigationProps> {
  private navigation: ReactNavigation.NavigationContainerComponent | null;

  constructor(props: IReduxNavigationProps) {
    super(props);

    this.navigation = null;
  }

  public componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleHardwareBack(),
    );
  }

  public render() {
    return (
      <AppNavigation
        ref={(navRef: ReactNavigation.NavigationContainerComponent | null) =>
          (this.navigation = navRef)
        }
      />
    );
  }

  private handleHardwareBack = () => () => {
    // Back performs pop, unless we're to main screen [0,0]
    if (
      this.props.nav &&
      this.props.nav.index === 0 &&
      this.props.nav.routes[0].index === 0
    ) {
      BackHandler.exitApp();
      return true;
    }
    return false;
  };
}

const mapStateToProps = (state: IReducers) => ({
  nav: state.nav,
});
export default connect(mapStateToProps)(ReduxNavigation);
