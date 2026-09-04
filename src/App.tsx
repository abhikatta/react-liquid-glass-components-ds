import { Switch } from "./components/ui/switch";

const App = () => {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex h-fit w-fit flex-col gap-5">
        <Switch />
        <Switch variant="sm" />
        <Switch variant="md" />
        <Switch variant="lg" />
      </div>
    </main>
  );
};

export default App;
