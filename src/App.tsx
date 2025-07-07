
import HealthAssistant from './components/HealthAssistant';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="h-screen bg-gray-50">
      <HealthAssistant />
      <Toaster />
    </div>
  );
}

export default App;
