import { Component } from 'react';
import ErrorMessage from '../../components/commons/ErrorMessage';

class ErrorPage extends Component {
  state = {
    error: false,
    message: '',
  };

  componentDidCatch(error, info) {
    this.setState({ error: true, message: error.message });
    console.error('error', error, 'info', info);
  }

  render() {
    const { children } = this.props;

    return this.error ? <ErrorMessage error={this.error} /> : children;
  }
}

export default ErrorPage;
