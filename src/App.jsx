import { useStudy } from './context/StudyContext.jsx';
import StartScreen from './components/StartScreen.jsx';
import ControlBar from './components/ControlBar.jsx';
import ChatApp from './sites/chat/ChatApp.jsx';
import ProductSite from './sites/product/ProductSite.jsx';
import CommunitySite from './sites/community/CommunitySite.jsx';

export default function App() {
  const { participant, site, sessionId } = useStudy();

  if (!participant) return <StartScreen />;

  // All three sites stay mounted so progress is kept when switching tabs.
  // Restart changes sessionId, which remounts everything from scratch.
  return (
    <>
      <ControlBar />
      <div key={sessionId}>
        <div hidden={site !== 'chat'}>
          <ChatApp />
        </div>
        <div hidden={site !== 'product'}>
          <ProductSite />
        </div>
        <div hidden={site !== 'community'}>
          <CommunitySite />
        </div>
      </div>
    </>
  );
}
