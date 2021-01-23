import * as React from 'react';
import {Animated, StatusBar, StyleSheet, View} from 'react-native';

interface IAppLoaderProps {
  children?: React.ReactNode;
  isLoaded: boolean;
  imageSource: any;
  backgroundStyle: any;
}
interface IAppLoaderState {
  animationDone: boolean;
  loadingProgress: Animated.Value;
}

export default class AppLoader extends React.Component<
  IAppLoaderProps,
  IAppLoaderState
> {
  public static defaultProps = {
    isLoaded: false,
  };

  public state = {
    animationDone: false,
    loadingProgress: new Animated.Value(0),
  };

  private interval: NodeJS.Timeout | null = null;

  public componentDidMount() {
    this.interval = setInterval(
      () =>
        Animated.timing(this.state.loadingProgress, {
          duration: 1000,
          toValue: this.state.animationDone ? 0 : 100,
          useNativeDriver: true,
        }).start(() => {
          this.setState((prvState: any) => ({
            animationDone: !prvState.animationDone,
          }));
        }),
      1000,
    );
  }

  public componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  public render() {
    const appScale = {
      transform: [
        {
          scale: this.state.loadingProgress.interpolate({
            inputRange: [0, 25, 100],
            outputRange: [1.1, 1.03, 1.2],
          }),
        },
      ],
    };

    const fullScreenWhiteLayer = this.state.animationDone ? null : (
      <View style={[StyleSheet.absoluteFill, styles.fullScreenWhiteLayer]} />
    );

    return (
      <View style={styles.fullScreen}>
        <StatusBar
          animated={true}
          barStyle="dark-content"
          hidden={!this.props.isLoaded}
        />
        {fullScreenWhiteLayer}
        <View style={styles.centeredFullScreen}>
          <Animated.Image
            style={[styles.maskImageStyle, appScale]}
            source={this.props.imageSource}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredFullScreen: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  fullScreenWhiteLayer: {
    backgroundColor: 'white',
  },
  maskImageStyle: {
    height: 140,
    width: 140,
  },
});
