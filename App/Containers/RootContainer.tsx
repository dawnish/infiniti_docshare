import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from '@react-native-community/netinfo';
import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import {Snackbar} from 'react-native-paper';
import {connect} from 'react-redux';
import {isEmpty} from 'validate.js';
import {IUser} from '../Interfaces';
import ReduxNavigation from '../Navigators/ReduxNavigator';
import {IReducers} from '../Redux';
import ConnectivityActions from '../Redux/ConnectivityRedux';
import StatusMsgBoxActions from '../Redux/StatusMsgBoxRedux';
import {displayInfo} from '../Services/LogService';
import {Colors} from '../Themes';
import styles from './Styles/RootContainerStyles';

interface IRootContainerProps {
  statusMessage: string | null;
  statusVariant: string | null;
  user: IUser | null;

  clearStatus: () => void;
  setConnectivityProps(state: NetInfoState): void;
}
interface IRootContainerState {
  unsubscribeNetInfo: NetInfoSubscription | null;
}
class RootContainer extends Component<
  IRootContainerProps,
  IRootContainerState
> {
  constructor(props: IRootContainerProps) {
    super(props);

    this.state = {
      unsubscribeNetInfo: null,
    };
  }

  public componentDidMount() {
    const unsubscribeNetInfo = NetInfo.addEventListener(
      this.subscribeConnectionChange,
    );
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({unsubscribeNetInfo});
  }

  public componentWillUnmount() {
    const {unsubscribeNetInfo} = this.state;
    if (unsubscribeNetInfo) {
      unsubscribeNetInfo();
    }
  }

  public render() {
    const {statusMessage, statusVariant} = this.props;
    const snackStyle =
      statusVariant === 'error' ? {backgroundColor: Colors.error} : undefined;
    return (
      <View style={styles.applicationView}>
        <StatusBar
          backgroundColor={Colors.primary}
          barStyle="light-content"
          translucent={false}
        />
        <ReduxNavigation />
        <Snackbar
          visible={!isEmpty(statusMessage)}
          onDismiss={this.onDismissSnackBar}
          style={snackStyle}
          action={{
            label: 'Undo',
            onPress: this.onDismissSnackBar,
          }}>
          {statusMessage}
        </Snackbar>
      </View>
    );
  }

  private onDismissSnackBar = () => {
    this.props.clearStatus();
  };

  private subscribeConnectionChange = (state: NetInfoState) => {
    displayInfo({
      name: 'RootContainer',
      preview: 'subscribeConnectionChange',
      value: {state},
    });
    this.props.setConnectivityProps(state);
  };
}
const mapStateToProps = (state: IReducers) => ({
  statusMessage: state.statusMsgBox.statusMessage,
  statusVariant: state.statusMsgBox.variant,
  user: state.auth.user,
});
const mapDispatchToProps = (dispatch: any) => ({
  clearStatus: () => dispatch(StatusMsgBoxActions.clearStatus()),
  setConnectivityProps: (state: NetInfoState) => {
    dispatch(ConnectivityActions.setConnectionState(state));
    dispatch(ConnectivityActions.setIsConnected(state.isConnected));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
