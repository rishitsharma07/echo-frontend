import './LoadingSpinner.css';

export default function LoadingSpinner({ text = 'Loading...', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="spinner-backdrop">
        <div className="spinner-container">
          <div className="spinner-ring">
            <div className="spinner-ring-inner" />
          </div>
          {text && <p className="spinner-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="spinner-container">
      <div className="spinner-ring">
        <div className="spinner-ring-inner" />
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
