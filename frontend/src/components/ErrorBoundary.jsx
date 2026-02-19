import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[WizKlub Error]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-red-100 p-8">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <pre className="text-xs text-red-600 bg-red-50 rounded-xl p-4 overflow-auto whitespace-pre-wrap">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => this.setState({ error: null })}
              className="mt-4 px-5 py-2 bg-wiz-purple text-white rounded-xl text-sm font-semibold hover:opacity-90 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
