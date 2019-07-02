import React, { Component } from 'react';
import { 
  ScrollView, 
  StyleSheet,
  View,
} from 'react-native';
import ArticleList from '../components/ArticleList';
import { connect } from 'react-redux';
import { fetchClipped } from '../actions';
import { NavigationEvents } from 'react-navigation';
import { clipArticle, unclipArticle } from '../actions';

class ClippedScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { fetching, data, clipped, unclipped } = nextProps;
    this.setState({ fetching, data, clipped, unclipped });
  }

  onToggleClip = (item, index) => {
    if (!item.clipped) {
      this.props.dispatch(clipArticle(item));
    } else {
      this.props.dispatch(unclipArticle(item));
    }
  }

  onPressItem = (item, index) => {
    this.props.navigation.push('Modal', {
      url: item.web_url
    });
  }

  onRefresh = () => {

  }

  render() {
    const { data } = this.state;
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => this.props.dispatch(fetchClipped())}
        />
        <ArticleList
          data={data}
          onPressItem={this.onPressItem}
          onToggleClip={this.onToggleClip}
          onRefresh={this.onRefresh}
        />
      </View>
    );
  }
}

ClippedScreen.navigationOptions = {
  title: 'Clipped'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});


export default connect(state => {
  return {
    data: state.clip.items,
    fetching: state.clip.isFetching
  }
})(ClippedScreen);