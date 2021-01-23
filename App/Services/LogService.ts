import crashlytics from '@react-native-firebase/crashlytics';

export const errorLog = (
  errObj: {method: string; class: string},
  props: any,
) => {
  // @ts-ignore: console has tron obj during run time
  // tslint:disable-next-line
  // eslint-disable-next-line prettier/prettier
  __DEV__ && console.tron.display({
      name: `Exception (${errObj.method})`,
      preview: `in ${errObj.class}`,
      value: props,
    });

  // tslint:disable-next-line
  // console.log(JSON.stringify({errObj, props}));

  crashlytics().recordError(props, JSON.stringify({errObj, props}));
  crashlytics().setAttribute('Method', errObj.method);
  crashlytics().setAttribute('Class', errObj.class);
};

export const debugLog = (info: any) => {
  // @ts-ignore: console has tron obj during run time
  // tslint:disable-next-line
  // eslint-disable-next-line prettier/prettier
  __DEV__ && console.tron.display({
      name: info.k || info.ak || 'debugLog',
      value: {info},
    });
};

export interface IDisplayInfo {
  important?: boolean;
  name: string;
  preview: string;
  value: object;
}

export const displayInfo = (info: IDisplayInfo) => {
  // @ts-ignore: console has tron obj during run time
  // tslint:disable-next-line
  __DEV__ && console.tron.display(info);

  // tslint:disable-next-line
  // console.log(JSON.stringify(info));
};
