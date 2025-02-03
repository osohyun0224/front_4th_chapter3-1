import { Providers } from './app/providers';
import { EventManagePage } from '@/pages/event/EventManagePage';
function App() {
  return (
    <Providers>
      <EventManagePage />;
    </Providers>
  );
}

export default App;
