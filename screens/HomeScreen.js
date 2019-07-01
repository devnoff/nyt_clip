import React, { Component } from 'react';
import { SearchBar } from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import ArticleList from '../components/ArticleList';
import { connect } from 'react-redux';
import { searchArticle, clipArticle, unclipArticle } from '../actions';

class HomeScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      search: '',
      fetching: props.fetching,
      data: props.data,
      abortController: null,
      clipped: props.clipped
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fetching, data, abortController, clipped } = nextProps;

    this.setState({ fetching, data, abortController, clipped });
  }

  updateSearch = (search) => {
    const { abortController } = this.state;
    this.setState({search});
    if (search && search.length >= 3) {
      // Cancel Previous Request
      console.log(abortController, 'abortController')
      if (abortController) abortController.abort();
      this.props.dispatch(searchArticle(search));
    } else {
      this.setState({
        fetching: false,
        data: []
      });
    }
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
    const { search, data, fetching } = this.state;
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          value={search}
          lightTheme={true}
          platform={'ios'}
          showLoading={fetching}
        />
        {fetching 
        ? <Text>Fetching</Text>
        : <ArticleList
            data={data}
            onPressItem={this.onPressItem}
            onToggleClip={this.onToggleClip}
            onRefresh={this.onRefresh}
          />}
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  title: 'Search'
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }

});


export default connect(state => {
  return {
    data: state.article.items,
    fetching: state.article.isFetching,
    abortController: state.article.abortController,
    clipped: state.clip.items
  }
})(HomeScreen);