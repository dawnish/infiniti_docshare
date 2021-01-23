import React, {Component} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  ToastAndroid,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button, Card, Input} from 'react-native-elements';
import {ActivityIndicator, Dialog, Portal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNavigation from 'react-navigation';
import {connect} from 'react-redux';
import validate, {isEmpty} from 'validate.js';
import {IUser} from '../Interfaces';
import {ScreenNameEnum} from '../Literals';
import {IReducers} from '../Redux';
import AuthActions from '../Redux/AuthRedux';
import {displayInfo} from '../Services/LogService';
import {Colors, Images} from '../Themes';
import loginStyles from './Styles/LoginScreenStyle';

interface ILoginScreenState {
  email: string;
  password: string;
  forgotPassAttempted: boolean;
  modalVisible: boolean;
  signInAttempted: boolean;
}
interface ILoginScreenProps {
  isAuthenticating: boolean;
  navigation: ReactNavigation.NavigationScreenProp<
    any,
    ReactNavigation.NavigationStackAction
  >;
  user: IUser | null;

  forgotPassword(email: string): void;
  signIn(email: string, password: string): void;
}
export class LoginScreen extends Component<
  ILoginScreenProps,
  ILoginScreenState
> {
  public static navigationOptions = {
    header: null,
  };

  public constructor(props: ILoginScreenProps) {
    super(props);

    this.state = {
      email: '',
      password: '',
      forgotPassAttempted: false,
      modalVisible: false,
      signInAttempted: false,
    };
  }

  public componentDidUpdate() {
    displayInfo({
      name: 'LoginScreen',
      preview: 'didUpdate',
      value: {
        isAuth: this.props.isAuthenticating,
        signInAttempt: this.state.signInAttempted,
        user: this.props.user,
        props: this.props,
      },
    });
    if (
      !this.props.isAuthenticating &&
      this.state.signInAttempted &&
      !this.props.user
    ) {
      ToastAndroid.show('Email / Password is invalid.', ToastAndroid.LONG);
    }
    if (this.props.user) {
      displayInfo({
        name: 'LoginScreen',
        preview: 'didUpdate_elseif',
        value: {state: this.state, props: this.props},
      });
      this.props.navigation.navigate(ScreenNameEnum.Launcher);
    }
  }

  public render() {
    const {email, modalVisible} = this.state;
    const {isAuthenticating} = this.props;
    if (this.state.forgotPassAttempted && !this.props.isAuthenticating) {
      this.setState({forgotPassAttempted: false, modalVisible: false});
    }
    const emailErrors = validate(
      {email},
      {
        email: {
          email: true,
        },
      },
    );

    displayInfo({
      name: 'SignInScreen',
      preview: 'render',
      value: {email, emailErrors},
    });
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={loginStyles.keyboardView}>
        <SafeAreaView style={loginStyles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Card containerStyle={loginStyles.inner}>
              <Card.Image source={Images.logo} style={loginStyles.cardImage} />
              <Input
                containerStyle={loginStyles.inputContainer}
                label="Email"
                placeholder="Email.."
                onChangeText={(text) => this.setState({email: text})}
                returnKeyType="next"
                leftIcon={<Icon name="mail" size={32} color="black" />}
              />
              <Input
                containerStyle={loginStyles.inputContainer}
                label="Password"
                placeholder="Password.."
                secureTextEntry={true}
                onChangeText={(text) => this.setState({password: text})}
                returnKeyType="done"
                leftIcon={<Icon name="lock" size={32} color="black" />}
              />
              <View style={loginStyles.btnContainer}>
                <Button
                  title="SIGN IN"
                  disabled={this.props.isAuthenticating}
                  loading={this.props.isAuthenticating}
                  loadingProps={{color: Colors.secondary, size: 'large'}}
                  titleStyle={loginStyles.signInButtonTitle}
                  buttonStyle={loginStyles.signInButton}
                  onPress={this.onLogin}
                />
                <View style={loginStyles.centerView}>
                  <Text> Don't have an account? </Text>
                  <Button
                    title="SIGN UP"
                    type="clear"
                    titleStyle={{color: Colors.secondary}}
                    onPress={() =>
                      this.props.navigation.navigate(ScreenNameEnum.SignUp)
                    }
                  />
                </View>
                <View style={loginStyles.centerView}>
                  <Text> or </Text>
                </View>
                <View style={loginStyles.centerView}>
                  <Button
                    title="Forgot Password?"
                    type="clear"
                    titleStyle={{color: Colors.secondary}}
                    onPress={() => this.setState({modalVisible: true})}
                  />
                </View>
              </View>
              <View style={loginStyles.container} />
            </Card>
          </TouchableWithoutFeedback>
          <Portal>
            <Dialog
              visible={modalVisible}
              onDismiss={() => this.setState({modalVisible: false})}>
              <Dialog.Title>
                <Text style={loginStyles.modalText}>Password Reset</Text>
              </Dialog.Title>
              <Dialog.Content>
                <Input
                  containerStyle={loginStyles.inputContainer}
                  placeholder="Enter your email id"
                  onChangeText={(text) => this.setState({email: text})}
                  returnKeyType="next"
                />
              </Dialog.Content>
              <Dialog.Actions>
                <View style={loginStyles.centerView}>
                  <Button
                    title="Cancel"
                    type="clear"
                    titleStyle={{color: Colors.primary}}
                    onPress={() => {
                      this.setState({modalVisible: false});
                    }}
                  />
                  <TouchableHighlight
                    disabled={!isEmpty(emailErrors) || isAuthenticating}
                    style={loginStyles.openButton}
                    onPress={this.onForgotPassword}>
                    {(isAuthenticating && (
                      <ActivityIndicator
                        size="small"
                        color={Colors.secondary}
                      />
                    )) || <Text style={loginStyles.textStyle}>Reset</Text>}
                  </TouchableHighlight>
                </View>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  private onLogin = () => {
    const {email, password} = this.state;
    this.props.signIn(email, password);
    this.setState({signInAttempted: true});
  };

  private onForgotPassword = () => {
    const {email} = this.state;
    const emailErrors = validate(
      {email},
      {
        email: {
          email: true,
        },
      },
    );
    displayInfo({
      name: 'SignInScreen',
      preview: 'onForgotPassword',
      value: {email, emailErrors},
    });
    if (!emailErrors) {
      this.setState({forgotPassAttempted: true});
      this.props.forgotPassword(email);
    }
  };
}

const mapStateToProps = (state: IReducers) => ({
  isAuthenticating: state.auth.isAuthenticating,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  forgotPassword: (email: string) =>
    dispatch(AuthActions.forgotPassword(email)),
  signIn: (email: string, password: string) =>
    dispatch(AuthActions.signInEmail(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
