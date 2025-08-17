import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // تغيير الحالة لإظهار واجهة بديلة
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // يمكن تسجيل الخطأ في خدمة تتبع الأخطاء
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // واجهة بديلة عند حدوث الخطأ
      return <h2>حدث خطأ ما.</h2>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
