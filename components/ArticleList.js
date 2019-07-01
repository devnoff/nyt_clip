import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Button,
  RefreshControl
} from 'react-native';
import moment from 'moment';

moment.locale('ko', {
  meridiem: function(hour, minute, isLower) {
    if (hour < 12) return '오전';
    return '오후';
  }
});

class Cell extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
      index: props.index
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      item: nextProps.item,
      index: nextProps.index
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { item: oldItem } = this.state;
    const { item, index } = nextState;
    return item.clipped != oldItem.clipped;
  }

  onPressItem = (item, index) => {
    this.props.onPressItem(item, index);
  }

  onToggleClip = (item, index) => {
    this.props.onToggleClip(item, index);
  }

  render() {
    const { item, index } = this.state;
    return (
      <TouchableOpacity
        onPress={this.onPressItem.bind(this, item, index)}
        style={styles.cell}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 6}}>
            <Text style={styles.title}>{item.headline.main}</Text>
            <Text style={styles.date}>{moment(item.pub_date).format('YYYY년 MM월 DD일 a h시 m분')}</Text>
          </View>
          <View style={{flex: 2}}>
            <Button
              title={item.clipped ? 'Unclip' : 'Clip'}
              onPress={this.onToggleClip.bind(this, item, index)}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

}

export default class ArticleList extends Component {

  static propTypes = {
    data: PropTypes.array,
    onToggleClip: PropTypes.func.isRequired,
    onPressItem: PropTypes.func.isRequired,
    onRefresh: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      refreshing: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ data: nextProps.data});
  }

  onPressItem = (item, index) => {
    this.props.onPressItem(item, index);
  }

  onToggleClip = (item, index) => {
    const { data } = this.state;
    data[index] = Object.assign({}, item, {clipped: !item.clipped});

    this.setState({data : [...data]});

    if (this.props.onToggleClip) {
      this.props.onToggleClip(item, index);
    } 
  }

  onRefresh = () => {
    this.props.onRefresh();
  }

  renderCell = ({item, index}) => (
    <Cell
        onPressItem={this.onPressItem.bind(this, item, index)}
        onToggleClip={this.onToggleClip.bind(this, item, index)}
        style={styles.cell}
        item={item}
        index={index}
      />
  );

  render() {
    const { search, data, refreshing } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={data}
          renderItem={this.renderCell}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cell: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  title: {
    color: 'black', 
    fontWeight: 'bold',
    fontSize: 18
  },
  date: {
    color: 'black'
  }
});

