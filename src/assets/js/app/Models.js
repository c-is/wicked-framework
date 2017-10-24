export default class Model {
  constructor(props) {
    this.props = props;
    this.slag = this.props.slag;
  }
  Home = () => '../data/articles.json';
  Article = () => `../data/${this.slag}.json`;
}
