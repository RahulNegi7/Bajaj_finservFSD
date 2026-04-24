import { useState } from 'react';
import './index.css';

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
                match = match.replace(/"/g, ''); // Optional: remove quotes from keys
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function App() {
  const [inputVal, setInputVal] = useState('{\n  "data": ["A->B", "A->C", "B->D"]\n}');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setResponse(null);
    setLoading(true);

    try {
      // Validate local JSON parse to prevent bad request structure
      const parsed = JSON.parse(inputVal);
      
      const res = await fetch('http://localhost:3000/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsed)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Something went wrong processing your request');
      } else {
        setResponse(data);
      }
    } catch (err) {
      setError('Invalid JSON format. Please check your syntax.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header className="header">
          <h1>Data Insights Engine</h1>
          <p>Hierarchical Relationship Analyzer</p>
        </header>

        <section className="input-section">
          <div className="input-wrapper">
            <label className="input-label" style={{marginBottom: '0.5rem'}}>
              Enter Nodes Data
              <span style={{fontSize:'0.85rem', color: 'var(--text-muted)'}}>JSON Format</span>
            </label>
            <textarea 
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder='{ "data": ["u->v"] }'
            />
          </div>
          
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Analyze Graph'}
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </section>

        {response && (
          <section className="results-section">
            <h2 className="results-header">Analysis Results</h2>
            
            <h3 style={{marginBottom: '0.8rem', color: 'var(--text-muted)', fontSize: '1.1rem'}}>Full API Response</h3>
            <pre 
              className="json-viewer" 
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(response) }} 
            />
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
