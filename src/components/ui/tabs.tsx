import {
  createContext,
  memo,
  useContext,
  useState,
  type HTMLAttributes,
} from "react";

const TabsContext = createContext<{
  activeTab: string;
  handleTabChange: (tab: string) => void;
} | null>(null);

type DivProps = HTMLAttributes<HTMLDivElement>;

interface TabsValue {
  value: string;
}

interface TabsProps extends DivProps {
  defaultValue: string;
}

export const Tabs = memo(({ children, defaultValue, ...props }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return (
    <div {...props}>
      <TabsContext.Provider value={{ activeTab, handleTabChange }}>
        {children}
      </TabsContext.Provider>
    </div>
  );
});
Tabs.displayName = "Tabs";

interface TabsListProps extends DivProps {}
export const TabsList = memo(({ children, ...props }: TabsListProps) => {
  return <div {...props}>{children}</div>;
});
TabsList.displayName = "TabsList";

interface TabsTriggerProps
  extends HTMLAttributes<HTMLButtonElement>, TabsValue {}
export const TabsTrigger = memo(
  ({ children, onClick, value, ...props }: TabsTriggerProps) => {
    const context = useContext(TabsContext);
    if (!context) return;
    const { handleTabChange } = context;
    return (
      <button
        {...props}
        onClick={(e) => {
          onClick?.(e);
          handleTabChange(value);
        }}
      >
        {children}
      </button>
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends Omit<TabsProps, "defaultValue">, TabsValue {}
export const TabsContent = memo(
  ({ children, value, ...props }: TabsContentProps) => {
    const context = useContext(TabsContext);
    if (!context) return;
    const { activeTab } = context;
    if (value !== activeTab) return <></>;
    return <div {...props}>{children}</div>;
  },
);
TabsContent.displayName = "TabsContent";
