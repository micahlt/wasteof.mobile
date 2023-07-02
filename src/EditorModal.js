import * as React from 'react';
import { View } from 'react-native';
import {
  Appbar,
  IconButton,
  TextInput,
  ProgressBar,
  Banner,
  useTheme,
} from 'react-native-paper';
import MarkdownIt from 'markdown-it';
import links from '../utils/links';
import { wasteofURL } from './apiURL';
import s from '../styles/EditorModal.module.css';
import { GlobalContext } from '../App';
import markdownItUnderline from '@accordproject/markdown-it-underline';
import markdownItMark from 'markdown-it-mark';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditorModal = ({ closeModal, repostId }) => {
  const { colors } = useTheme();
  const { token } = React.useContext(GlobalContext);
  const [selection, setSelection] = React.useState({ start: 0, end: 0 });
  const [postContent, setPostContent] = React.useState('');
  const [isPosting, setIsPosting] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(null);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    AsyncStorage.getItem('editorBanner').then(value => {
      if (value == 'seen') {
        setShowBanner(false);
      } else {
        setShowBanner(true);
      }
    });
  }, []);
  const submitPost = () => {
    setIsPosting(true);
    const md = new MarkdownIt().use(markdownItUnderline).use(markdownItMark);
    const post = md.render(postContent).trim();
    fetch(`https://api.wasteof.money/posts/`, {
      method: 'POST',
      headers: {
        authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post: post,
        repost: repostId || null,
      }),
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        setTimeout(() => {
          closeModal(true);
        }, 3000);
      });
  };
  const browserEditor = () => {
    links.open(`${wasteofURL}/posts/new`, colors.primary);
  };
  const changeSelection = e => {
    setSelection({
      start: e.nativeEvent.selection.start,
      end: e.nativeEvent.selection.end,
    });
  };
  const format = action => {
    const insert = (str, index, value) => {
      return str.substr(0, index) + value + str.substr(index);
    };
    const wrap = (str, indexOne, indexTwo, value) => {
      return (
        str.slice(0, indexOne) +
        value +
        str.slice(indexOne, indexTwo) +
        value +
        str.slice(indexTwo)
      );
    };
    const getStrings = () => {
      switch (action) {
        case 'bold': {
          return {
            string: '**',
            wrap: true,
          };
        }
        case 'italic': {
          return {
            string: '*',
            wrap: true,
          };
        }
        case 'underline': {
          return {
            string: '_',
            wrap: true,
          };
        }
        case 'strikethrough': {
          return {
            string: '~~',
            wrap: true,
          };
        }
        case 'highlight': {
          return {
            string: '==',
            wrap: true,
          };
        }
        case 'quote': {
          return {
            string: '> ',
            wrap: false,
          };
        }
        case 'code': {
          return {
            string: '`',
            wrap: true,
          };
        }
      }
    };
    const fmt = getStrings();
    if (fmt.wrap) {
      setPostContent(
        wrap(postContent, selection.start, selection.end, fmt.string),
      );
    } else {
      setPostContent(insert(postContent, selection.start, fmt.string));
    }
    setSelection({
      start: selection.end + fmt.string.length,
      end: selection.end + fmt.string.length,
    });
  };
  return (
    <>
      <Appbar style={{ backgroundColor: colors.elevation.level2, zIndex: 1 }}>
        <Appbar.BackAction onPress={() => closeModal(false)} />
        <Appbar.Content title={repostId ? 'New repost' : 'New post'} />
        <Appbar.Action
          icon="open-in-new"
          onPress={browserEditor}
          iconColor={colors.secondary}
          accessibilityLabel="Open editor in browser"
        />
        <Appbar.Action
          icon="check"
          onPress={submitPost}
          iconColor={colors.secondary}
          accessibilityLabel="Share post"
        />
      </Appbar>
      <View style={{ flex: 1, backgroundColor: colors.surfaceVariant }}>
        <Banner
          visible={showBanner === true}
          actions={[
            {
              label: 'Okay, thanks',
              onPress: () => {
                AsyncStorage.setItem('editorBanner', 'seen').then(() => {
                  setShowBanner(false);
                });
              },
            },
          ]}
          icon="flask">
          The post editor is a new feature that's still in beta! You may
          encounter bugs and issues for the next few weeks until it's fully
          stable.
        </Banner>
        <ProgressBar
          indeterminate={isPosting}
          visible={false}
          color={colors.primary}
        />
        <TextInput
          ref={inputRef}
          autoFocus={true}
          style={{ flex: 1 }}
          theme={{ roundness: 0 }}
          multiline={true}
          onSelectionChange={changeSelection}
          onChangeText={setPostContent}
          value={postContent}
          selection={selection}
        />
        <View
          style={{ ...s.toolbar, backgroundColor: colors.elevation.level1 }}>
          <IconButton
            icon="format-bold"
            onPress={() => format('bold')}
            style={s.formatIcon}
          />
          <IconButton
            icon="format-italic"
            onPress={() => format('italic')}
            style={s.formatIcon}
          />
          <IconButton
            icon="format-underline"
            onPress={() => format('underline')}
            style={s.formatIcon}
          />
          <IconButton
            icon="format-strikethrough"
            onPress={() => format('strikethrough')}
            style={s.formatIcon}
          />
          <IconButton
            icon="format-color-highlight"
            onPress={() => format('highlight')}
            style={s.formatIcon}
          />
          <IconButton
            icon="format-quote-close"
            onPress={() => format('quote')}
            style={s.formatIcon}
          />
          <IconButton
            icon="code-braces"
            onPress={() => format('code')}
            style={s.formatIcon}
          />
          <IconButton
            icon="image-plus"
            onPress={() => alert('This feature is coming soon!')}
            style={s.formatIcon}
          />
        </View>
      </View>
    </>
  );
};

export default EditorModal;
