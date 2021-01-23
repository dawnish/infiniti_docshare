import Colors from './Colors'

const type = {
  light: 'Montserrat-Light',
  regular: 'Montserrat-Regular',
  medium: 'Montserrat-Medium',
  semibold: 'Montserrat-SemiBold',
  bold: 'Montserrat-Bold',
  emphasis: 'Montserrat-Italic',
  altregular: 'OpenSans-Regular',
  altsemibold: 'OpenSans-Semibold'
}

const size = {
  cta: 24,
  display4: 112,
  display3: 56,
  display2: 45,
  display1: 34,
  headline: 24,
  title: 20,
  subHeading: 16,
  body2: 14,
  body1: 14,
  caption: 12,
  button: 14
}

const style = {
  ctaButton: {
    fontFamily: type.medium,
    fontSize: size.cta,
    color: Colors.text,
    opacity: 0.87
  },
  display4: {
    fontFamily: type.light,
    fontSize: size.display4,
    color: Colors.text,
    opacity: 0.54
  },
  display3: {
    fontFamily: type.regular,
    fontSize: size.display3,
    color: Colors.text,
    opacity: 0.54
  },
  display2: {
    fontFamily: type.regular,
    fontSize: size.display2,
    lineHeight: 48,
    color: Colors.text,
    opacity: 0.54
  },
  display1: {
    fontFamily: type.regular,
    fontSize: size.display1,
    lineHeight: 40,
    color: Colors.text,
    opacity: 0.54
  },
  headline: {
    fontFamily: type.regular,
    fontSize: size.headline,
    lineHeight: 32,
    color: Colors.text,
    opacity: 0.87
  },
  title: {
    fontFamily: type.medium,
    fontSize: size.title,
    lineHeight: 28,
    color: Colors.text,
    opacity: 0.87
  },
  subHeading: {
    fontFamily: type.regular,
    fontSize: size.subHeading,
    lineHeight: 24,
    color: Colors.text,
    opacity: 0.87
  },
  body2: {
    fontFamily: type.medium,
    fontSize: size.body2,
    lineHeight: 20,
    color: Colors.text,
    opacity: 0.87
  },
  body1: {
    fontFamily: type.regular,
    fontSize: size.body1,
    lineHeight: 20,
    color: Colors.text,
    opacity: 0.87
  },
  caption: {
    fontFamily: type.regular,
    fontSize: size.caption,
    color: Colors.text,
    opacity: 0.54
  },
  button: {
    fontFamily: type.medium,
    fontSize: size.button,
    color: Colors.text,
    opacity: 0.87
  }
}

export default {
  type,
  size,
  style
}
