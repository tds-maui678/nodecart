import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error){ return { hasError: true, error }; }
  componentDidCatch(error, info){ console.error("[ErrorBoundary]", error, info); }
  render(){
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto p-6">
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <pre className="text-sm bg-red-50 border border-red-200 p-3 rounded overflow-auto">
            {String(this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}