import { useState } from 'react';
import { useStudy } from '../context/StudyContext.jsx';

export default function StartScreen() {
  const { start } = useStudy();
  const [name, setName] = useState('');
  const trimmed = name.trim();

  function onSubmit(e) {
    e.preventDefault();
    if (trimmed) start(trimmed, 'personalized');
  }

  return (
    <div className="start">
      <form className="start-card" onSubmit={onSubmit}>
        <span className="start-eyebrow">Phase 2 · controlled prototype evaluation</span>
        <h1>AI recommendation study</h1>
        <p className="start-lead">
          Imagine you're working with a small team. Your information is spread across spreadsheets, customer records,
          and sales data. Your team wants one platform to bring this information together and visualize it through
          dashboards. You will see one prepared AI recommendation. As you read, consider what you would check next
          and why.
        </p>

        <label className="field">
          <span>What should we call you?</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your first name"
            autoFocus
            autoComplete="off"
          />
        </label>

        <button type="submit" className="start-btn" disabled={!trimmed}>
          Start
        </button>
        <p className="start-note">
          This phase uses a scripted AI response. Lumen, the Reddit discussion, community users and customer stories
          are fictional research materials.
        </p>
      </form>
    </div>
  );
}
