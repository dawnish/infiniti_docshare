import React, {Component} from 'react';
import {ToastAndroid, View} from 'react-native';
import ReactNavigation from 'react-navigation';
import {connect} from 'react-redux';
import {isEmpty} from 'validate.js';
import AppLoader from '../Components/Loader/AppLoader';
import {ScreenNameEnum} from '../Literals/Enums';
import {IReducers} from '../Redux';
import {displayInfo} from '../Services/LogService';
import {Images} from '../Themes';
import styles from './Styles/LaunchScreenStyle';
import {IUser} from '../Interfaces';

interface ILaunchScreenProps {
  isAuthenticating: boolean;
  isNetAvailable: boolean;
  navigation: ReactNavigation.NavigationScreenProp<
    any,
    {routeName: string; type: string}
  >;
  user: IUser | null;
}
class LaunchScreen extends Component<ILaunchScreenProps> {
  private interval: NodeJS.Timeout | null = null;

  public constructor(props: ILaunchScreenProps) {
    super(props);

    this.state = {
      hasLoaded: false,
    };
  }

  public componentDidUpdate() {
    const {navigation, user, isAuthenticating} = this.props;
    const hasLoaded = !this.props.isAuthenticating && !isEmpty(this.props.user);

    if (hasLoaded && user) {
      // NOTE: timeout to allow time for animation to complete
      setTimeout(() => {
        navigation.navigate(ScreenNameEnum.App);
      }, 1000);
    } else if (!isAuthenticating && !user) {
      setTimeout(() => {
        navigation.navigate(ScreenNameEnum.Login);
      }, 1000);
    }
  }

  public componentDidMount() {
    this.interval = setInterval(() => {
      ToastAndroid.show(
        "Hmm! it's longer than usual. Please try relaunching app",
        ToastAndroid.LONG,
      );
      this.navigateScreen();
      if (this.interval) {
        clearInterval(this.interval);
      }
    }, 20000);
  }

  public componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  public render() {
    const hasLoaded = !this.props.isAuthenticating && !isEmpty(this.props.user);
    return (
      <View style={styles.container}>
        <AppLoader
          isLoaded={hasLoaded}
          imageSource={Images.logo}
          backgroundStyle={styles.loadingBackgroudView}
        />
      </View>
    );
  }

  private navigateScreen = () => {
    const {navigation, user, isAuthenticating} = this.props;
    const hasLoaded = !this.props.isAuthenticating && !isEmpty(user);
    displayInfo({
      name: 'LaunchScreen',
      preview: 'navigateScreen',
      value: {hasLoaded, props: this.props},
    });
    if (hasLoaded) {
      // NOTE: timeout to allow time for animation to complete
      setTimeout(() => {
        navigation.navigate(ScreenNameEnum.App);
      }, 1000);
    } else if (!isAuthenticating && !user) {
      if (this.interval) {
        clearInterval(this.interval);
      }
      setTimeout(() => {
        navigation.navigate(ScreenNameEnum.Login);
      }, 1500);
    }
  };
}

const mapStateToProps = (state: IReducers) => {
  return {
    isAuthenticating: state.auth.isAuthenticating,
    isNetAvailable: state.connection.isConnected,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps)(LaunchScreen);
