/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import DocumentPicker from 'react-native-document-picker';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Text,
  View,
  Alert,
  Share,
  PermissionsAndroid,
} from 'react-native';
import {
  Appbar,
  IconButton,
  BottomNavigation,
  Card,
  FAB,
  Menu,
} from 'react-native-paper';
import ReactNavigation from 'react-navigation';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {IReducers} from '../Redux';
import AuthActions from '../Redux/AuthRedux';
import StorageActions from '../Redux/StorageRedux';
import {connect} from 'react-redux';
import {displayInfo, errorLog} from '../Services/LogService';
import {IFileMeta} from '../Interfaces';
import {FileTypeEnum, ScreenNameEnum} from '../Literals/Enums';
import {Images} from '../Themes';
import RNFB from 'react-native-fetch-blob';
import FileViewer from 'react-native-file-viewer';
import {isArray} from 'validate.js';

type RoutesState = Array<{
  key: string;
  title: string;
  icon: string;
  color?: string;
  badge?: boolean;
  getAccessibilityLabel?: string;
  getTestID?: string;
}>;

type Route = {route: {key: string}};

interface IHomeScreenProps {
  documents: IFileMeta[] | null;
  images: IFileMeta[] | null;
  isDownloading: boolean;
  isUploading: boolean;
  navigation: ReactNavigation.NavigationScreenProp<
    any,
    ReactNavigation.NavigationStackAction
  >;

  checkAuthState: () => void;
  deleteFile: (name: string, type: string) => void;
  getFiles: (type: string) => void;
  uploadFile: (file: string, name: string, type: string) => void;
  signOut: () => void;
}
const GridViewer = (props: IHomeScreenProps, fileType: FileTypeEnum) => {
  const [showMenuId, setShowMenuId] = useState<string | null>(null);

  const onToggleMenu = (file: IFileMeta) =>
    setShowMenuId(!showMenuId ? file.FileName : null);
  const onCloseMenu = () => setShowMenuId(null);

  const RightContent = (file: IFileMeta) => (
    <Menu
      visible={showMenuId === file.FileName}
      onDismiss={onCloseMenu}
      anchor={
        <IconButton
          {...props}
          icon="dots-vertical"
          onPress={() => onToggleMenu(file)}
        />
      }>
      <Menu.Item
        icon="share-variant"
        onPress={() => onShare(file)}
        title="Share"
      />
      <Menu.Item
        icon="delete"
        onPress={() => onFileDelete(file, props, fileType)}
        title="Delete"
      />
    </Menu>
  );
  const data =
    fileType === FileTypeEnum.Images ? props.images : props.documents;

  return (
    <>
      {((props.isDownloading || props.isUploading) && (
        <View style={styles.centerScreen}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Please wait...</Text>
        </View>
      )) || (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.content}
          style={styles.scrollView}>
          {data &&
            data.map((file, idx) => {
              return (
                <Card
                  style={styles.item}
                  key={idx}
                  onPress={() => onViewFile(file, fileType)}>
                  <Card.Cover
                    source={
                      fileType === FileTypeEnum.Images
                        ? {uri: file.DownloadUrl}
                        : Images.noDocs
                    }
                    style={styles.photo}
                  />
                  <Card.Title
                    title={file.FileName}
                    subtitle={`${file.Size} ${file.Timestamp}`}
                    titleStyle={styles.txtTitle}
                    right={() => RightContent(file)}
                  />
                </Card>
              );
            })}
        </ScrollView>
      )}
    </>
  );
};

async function checkStoragePermission() {
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted) {
      return true;
    } else {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message:
            'Doc Share needs access to your external storage to share files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return permission === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (err) {
    errorLog(
      {method: 'checkStoragePermission_Exception', class: 'LocationService'},
      {err},
    );
    return false;
  }
}

const onFileDelete = (
  file: IFileMeta,
  props: IHomeScreenProps,
  fileType: FileTypeEnum,
) => {
  Alert.alert(
    'Delete file',
    `Do you want to delete ${file.FileName}`,
    [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => props.deleteFile(file.FileName, fileType),
      },
    ],
    {cancelable: false},
  );
};

const onShare = async (file: IFileMeta) => {
  try {
    const result = await Share.share({
      message: `Hey There! ${file.DownloadUrl}
      Shared via Doc Share`,
      url: file.DownloadUrl,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

const onViewFile = (file: IFileMeta, fileType: string) => {
  const fileExt = file.FileName.split('.');
  RNFB.config({
    // add this option that makes response data to be stored as a file,
    // this is much more performant.
    fileCache: true,
    appendExt: isArray(fileExt)
      ? fileExt[1]
      : fileType === FileTypeEnum.Documents
      ? '.pdf'
      : 'jpeg',
  })
    .fetch('GET', file.DownloadUrl)
    .then((res) => {
      // the temp file path
      displayInfo({
        name: 'HomeScreen',
        preview: 'fileViewer',
        value: {res: `The file saved to ', ${res.path()}`, fileExt},
      });
      FileViewer.open(`file://${res.path()}`);
    });
};

const HomeScreen = (props: IHomeScreenProps) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState<RoutesState>([
    {key: 'album', title: 'Album', icon: 'image-album', color: '#6200ee'},
    {
      key: 'library',
      title: 'Library',
      icon: 'inbox',
      color: '#2962ff',
    },
  ]);

  const {getFiles} = props;
  useEffect(() => {
    getFiles(index ? FileTypeEnum.Documents : FileTypeEnum.Images);
  }, [getFiles, index]);

  const onUploadFile = async () => {
    // Pick multiple files
    try {
      if (await checkStoragePermission()) {
        DocumentPicker.pickMultiple({
          type: [
            index ? DocumentPicker.types.pdf : DocumentPicker.types.images,
          ],
        }).then((results) => {
          for (const res of results) {
            displayInfo({
              name: 'HomeScreen',
              preview: 'onUploadFile',
              value: {
                res,
                uri: res.uri,
                type: res.type, // mime type
                name: res.name,
                size: res.size,
              },
            });
            props.uploadFile(
              res.uri,
              res.name,
              index ? FileTypeEnum.Documents : FileTypeEnum.Images,
            );
          }
        });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        errorLog(
          {
            method: 'DocumentPicker',
            class: 'HomeScreen',
          },
          {value: err},
        );
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Appbar.Header>
        <Appbar.Content title="Home" subtitle="Share your files easy" />
        <Appbar.Action
          icon="logout"
          onPress={() => {
            props.signOut();
            props.checkAuthState();
            props.navigation.navigate(ScreenNameEnum.Launcher);
          }}
        />
      </Appbar.Header>
      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={BottomNavigation.SceneMap({
          album: () => GridViewer(props, FileTypeEnum.Images),
          library: () => GridViewer(props, FileTypeEnum.Documents),
        })}
      />
      <FAB style={styles.fab} icon="plus" onPress={onUploadFile} />
    </>
  );
};

HomeScreen.navigationOptions = () => ({
  headerShown: false,
});

const mapStateToProps = (state: IReducers) => ({
  documents: state.storage.documents,
  images: state.storage.images,
  isDownloading: state.storage.isDownloading,
  isUploading: state.storage.isUploading,
});

const mapDispatchToProps = (dispatch: any) => ({
  checkAuthState: () => dispatch(AuthActions.checkAuthState()),
  getFiles: (fileType: string) => dispatch(StorageActions.getFiles(fileType)),
  uploadFile: (file: string, name: string, type: string) =>
    dispatch(StorageActions.uploadFile(file, name, type)),
  deleteFile: (name: string, type: string) =>
    dispatch(StorageActions.deleteFile(name, type)),
  signOut: () => dispatch(AuthActions.signOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  centerScreen: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    margin: 2,
  },
  item: {
    height: Dimensions.get('window').width / 2,
    width: '48%',
    margin: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 42,
    color: '#2962ff',
  },
  photo: {
    flex: 1,
    resizeMode: 'cover',
  },
  txtTitle: {
    fontSize: 16,
  },
});
