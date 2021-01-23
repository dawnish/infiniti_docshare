import React, {Component} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button, Card, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReactNavigation from 'react-navigation';
import {connect} from 'react-redux';
import validate from 'validate.js';
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
  confirmPassword: string;
  signUpAttempted: boolean;
}
interface ILoginScreenProps {
  isAuthenticating: boolean;
  navigation: ReactNavigation.NavigationScreenProp<
    any,
    ReactNavigation.NavigationStackAction
  >;
  user: IUser | null;

  signUp(email: string, password: string): void;
}
export class SignUpScreen extends Component<
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
      confirmPassword: '',
      signUpAttempted: false,
    };
  }

  public componentDidUpdate() {
    if (
      !this.props.isAuthenticating &&
      this.state.signUpAttempted &&
      !this.props.user
    ) {
      ToastAndroid.show('Sign up attempt failed.', ToastAndroid.LONG);
    } else if (
      !this.props.isAuthenticating &&
      this.state.signUpAttempted &&
      this.props.user
    ) {
      this.props.navigation.navigate(ScreenNameEnum.Launcher);
    }
  }

  public render() {
    const {password, confirmPassword} = this.state;
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
                textContentType="emailAddress"
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
                returnKeyType="next"
                leftIcon={<Icon name="lock" size={32} color="black" />}
              />
              <Input
                containerStyle={loginStyles.inputContainer}
                label="Confirm Password"
                placeholder="Renter Password.."
                secureTextEntry={true}
                onChangeText={(text) => this.setState({confirmPassword: text})}
                returnKeyType="done"
                leftIcon={<Icon name="lock" size={32} color="black" />}
                errorMessage={
                  password !== confirmPassword
                    ? 'Password and Confirm Password not matching!'
                    : undefined
                }
              />
              <View style={loginStyles.btnContainer}>
                <Button
                  title="SIGN UP"
                  disabled={this.props.isAuthenticating}
                  loading={this.props.isAuthenticating}
                  loadingProps={{color: Colors.secondary, size: 'large'}}
                  titleStyle={loginStyles.signInButtonTitle}
                  buttonStyle={loginStyles.signInButton}
                  onPress={this.onSignUp}
                />
              </View>
              <View style={loginStyles.container} />
            </Card>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  private onSignUp = () => {
    const {email, password, confirmPassword} = this.state;
    const emailErrors = validate(
      {email},
      {
        email: {
          email: true,
        },
      },
    );
    displayInfo({
      name: 'SignUpScreen',
      preview: 'onSignUp',
      value: {email, emailErrors},
    });
    if (!emailErrors && password === confirmPassword) {
      this.props.signUp(email, password);
    }
    this.setState({signUpAttempted: true});
  };
}

const mapStateToProps = (state: IReducers) => ({
  isAuthenticating: state.auth.isAuthenticating,
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: any) => ({
  signUp: (email: string, password: string) =>
    dispatch(AuthActions.signUpEmail(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
