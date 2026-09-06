import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs-custom";

const App = () => {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <Tabs defaultValue="test-c">
        <TabsList>
          <TabsTrigger value="test-a">TestA</TabsTrigger>
          <TabsTrigger value="test-b">TestB</TabsTrigger>
          <TabsTrigger value="test-c">TestC</TabsTrigger>
        </TabsList>
        <TabsContent value="test-a">TestA content</TabsContent>
        <TabsContent value="test-b">TestB content</TabsContent>
        <TabsContent value="test-c">TestC content</TabsContent>
      </Tabs>
    </main>
  );
};

export default App;
