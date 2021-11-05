import * as React from "react";
import { FlatList, ScrollView } from "react-native";
import ContentLoader, { Rect } from "react-content-loader/native";
import { v4 as uuidv4 } from "uuid";
import { WEB_URL } from "../config";
import ProductWrap from "./ProductWrap";

const MyLoader = (props) => (
  <ContentLoader
    speed={3}
    width={320}
    height={80}
    viewBox="0 0 320 80"
    backgroundColor="#ccc"
    foregroundColor="#ecebeb"
    animate={true}
    speed={0.7}
    {...props}
    style={{
      marginTop: 20,
    }}
  >
    <Rect x="115" y="6" rx="3" ry="3" width="175" height="8" />
    <Rect x="115" y="24" rx="3" ry="3" width="120" height="4" />
    <Rect x="115" y="34" rx="3" ry="3" width="100" height="6" />
    <Rect x="20" y="0" rx="3" ry="3" width="80" height="80" />
  </ContentLoader>
);

const renderItem = ({ item }) => <ProductWrap product={item} />;

export default class CatScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      page: 1,
      isLoadingMore: true,
    };
  }

  fetchProducts() {
    if (!this.state.isLoadingMore) {
      return;
    }
    const { route } = this.props;
    let category = "";
    if (route.params) {
      category = route.params.cat ? `&category=${route.params.cat}` : "";
    }
    fetch(
      `${WEB_URL}/wp-json/wc/v2/products?in_stock=true&page=${this.state.page}&per_page=7&status=publish&consumer_key=ck_7715caa12e093d9ab75cb9bbd4299610e53b34d5&consumer_secret=cs_4ee97b04bd222fd83bf6eaccb719ff58d24dcf68${category}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (this.state.page === 1) this.setState({ data: json });
        else this.setState({ data: [...this.state.data, ...json] });
      })
      .catch()
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  fetchMore = () => {
    this.setState({ page: this.state.page + 1, isLoadingMore: true }, () => {
      this.fetchProducts();
      this.setState({ isLoadingMore: false });
    });
  };

  componentDidMount() {
    this.fetchProducts();
  }

  render() {
    return this.state.isLoading ? (
      <ScrollView>
        <MyLoader />
        <MyLoader />
        <MyLoader />
        <MyLoader />
        <MyLoader />
        <MyLoader />
        <MyLoader />
      </ScrollView>
    ) : (
      <FlatList
        data={this.state.data}
        renderItem={renderItem}
        keyExtractor={() => uuidv4()}
        onEndReachedThreshold={0.75}
        onEndReached={this.fetchMore}
        showsVerticalScrollIndicator={false}
        initialNumToRender={7}
      />
    );
  }
}
