import { FC, useState, createContext } from "react";

type NavigationContextType = {
  navigationToggle: boolean;
  toggleNavigation: () => void;
  closeNavigation: () => void;
};

export const NavigationContext = createContext<NavigationContextType>(
  {} as NavigationContextType
);

type Props = {
  children?: React.ReactNode;
};

export const NavigationProvider: FC<Props> = ({ children }) => {
  const [navigationToggle, setNavigationToggle] = useState(false);

  const toggleNavigation = () => {
    setNavigationToggle(!navigationToggle);
  };

  const closeNavigation = () => {
    setNavigationToggle(false);
  };

  return (
    <NavigationContext.Provider
      value={{ navigationToggle, toggleNavigation, closeNavigation }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
