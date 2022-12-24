import * as React from 'react';
import {Card, useTheme} from 'react-native-paper';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import s from '../../styles/Comment.module.css';
import filter from '../../utils/filter';
import linkifyHtml from 'linkify-html';
import AutoImage from './AutoImage';
import {GlobalContext} from '../../App';

const Comment = React.memo(({comment}) => {
  const {colors} = useTheme();
  const {width} = useWindowDimensions();
  const [filteredHTML, setFilteredHTML] = React.useState(null);
  const {shouldFilter} = React.useContext(GlobalContext);
  React.useEffect(() => {
    if (shouldFilter && !filteredHTML) {
      filter(comment.content)
        .then(c => {
          setFilteredHTML(c);
        })
        .catch(err => {
          setFilteredHTML(comment.content);
        });
    } else if (!shouldFilter && !filteredHTML) {
      setFilteredHTML(comment.content);
    }
  }, []);
  const ImageRenderer = ({tnode}) => {
    return <AutoImage source={tnode.attributes.src} />;
  };
  const WebDisplay = React.memo(function WebDisplay({html}) {
    return (
      <RenderHtml
        source={{html: linkifyHtml(filteredHTML)}}
        contentWidth={width - 65}
        tagsStyles={{
          a: {color: colors.primary},
          p: {
            color: colors.onSurface,
            fontSize: '1.035rem',
            marginTop: 0,
            marginBottom: 0,
          },
          h1: {
            marginTop: 0,
            marginBottom: 0,
          },
          h2: {
            marginTop: 0,
            marginBottom: 0,
          },
        }}
        baseStyle={{color: colors.onSurface}}
        renderers={{img: React.useCallback(ImageRenderer, [])}}
      />
    );
  });
  return (
    <Card style={s.regularComment} mode="outlined">
      <Card.Content
        style={{
          margin: 0,
          paddingTop: 15,
          paddingVertical: 0,
          paddingBottom: 16,
        }}>
        {filteredHTML && <WebDisplay html={comment.content} />}
      </Card.Content>
    </Card>
  );
});

Comment.whyDidYouRender = {
  logOnDifferentValues: true,
};

export default Comment;
