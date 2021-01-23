import {StyleSheet} from 'react-native';
import {Colors, Fonts, Metrics} from '../../Themes';

export default StyleSheet.create({
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
  cancelView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  captionText: {
    ...Fonts.style.caption,
  },
  cardContainer: {
    margin: 10,
  },
  cardImage: {
    // alignItems: 'center',
    height: 140,
    justifyContent: 'center',
    marginVertical: 20,
    width: 140,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  centerView: {
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.secondary,
    flexDirection: 'row',
  },
  colorBlue: {color: 'blue'},
  confirmButton: {
    alignSelf: 'center',
    backgroundColor: Colors.secondary,
    borderColor: 'transparent',
    borderRadius: 5,
    borderWidth: 0,
    height: 45,
    paddingVertical: 10,
    width: 124,
  },
  confirmButtonTitle: {
    ...Fonts.style.button,
    color: Colors.ghostWhite,
    fontWeight: '700',
  },
  container: {
    alignContent: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  keyboardView: {
    alignContent: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    // flex: 1,
    justifyContent: 'flex-end',
    // padding: 24,
  },
  inputContainer: {
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    // backgroundColor: '#F194FF',
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  phoneNumberInput: {
    height: 60,
    marginTop: 15,
  },
  signInButton: {
    alignSelf: 'center',
    backgroundColor: Colors.secondary,
    borderColor: 'transparent',
    borderRadius: 5,
    borderWidth: 0,
    height: 45,
    paddingVertical: 10,
    width: 300,
  },
  signInButtonTitle: {
    ...Fonts.style.button,
    color: Colors.ghostWhite,
    fontWeight: '700',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleText: {
    ...Fonts.style.headline,
    color: Colors.secondary,
    fontWeight: '900',
  },
  titleView: {
    alignItems: 'center',
    marginBottom: Metrics.marginVertical,
    textAlign: 'center',
  },
  verificationTxt: {height: 40, marginTop: 15, marginBottom: 15},
});
