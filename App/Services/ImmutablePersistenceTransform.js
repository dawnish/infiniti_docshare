import R from 'ramda'
import Immutable from 'seamless-immutable'
import { createTransform } from 'redux-persist'

// is this object already Immutable?
const isImmutable = R.has('asMutable')

// change this Immutable object into a JS object
const convertToJs = (state) => state.asMutable({deep: true})

// optionally convert this object into a JS object if it is Immutable
const fromImmutable = R.when(isImmutable, convertToJs)

// convert this JS object into an Immutable object
const toImmutable = (raw) => Immutable.isImmutable(raw) ? raw : Immutable(raw)

// the transform interface that redux-persist is expecting
export default createTransform(
  (state, key) => (fromImmutable(state)),
  (state, key) => (toImmutable(state))
)
