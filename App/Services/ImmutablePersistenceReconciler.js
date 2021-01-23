import Immutable from 'seamless-immutable';

// eslint-disable-next-line no-undef
export default seamlessImmutableReconciler = (
  inboundState,
  originalState,
  reducedState,
  {debug = false, mergeDeep = false},
) => {
  let newState = {...reducedState};
  // only rehydrate if inboundState exists and is an object
  if (inboundState && typeof inboundState === 'object') {
    Object.keys(inboundState).forEach((key) => {
      // ignore _persist data
      if (key === '_persist') {
        return;
      }
      // if reducer modifies substate, skip auto rehydration
      if (originalState[key] !== reducedState[key]) {
        __DEV__ &&
          console.tron.log(
            'redux-persist/stateReconciler: sub state for key `%s` modified, skipping.',
            key,
          );
        return;
      }
      if (isPlainEnoughObject(reducedState[key])) {
        // if object is plain enough shallow merge the new values (hence "Level2")
        newState[key] = {...newState[key], ...inboundState[key]};
        return;
      } else if (isImmutable(reducedState[key])) {
        // if this is a seamless-immutable state slice, use its own merge function
        newState[key] = newState[key].merge(inboundState[key], {
          deep: mergeDeep,
        });
        return;
      }
      // otherwise hard set
      newState[key] = inboundState[key];
    });
  }

  // __DEV__ && typeof inboundState === 'object' &&
  //     console.tron.log(`redux-persist/stateReconciler: rehydrated keys '${Object.keys(inboundState).join(', ')}'`);

  return newState;
};

const isPlainEnoughObject = (o) =>
  o !== null && !Array.isArray(o) && typeof o === 'object' && !isImmutable(o);

const isImmutable = (a) => Immutable.isImmutable(a);
