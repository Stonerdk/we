export const wrapComponent =
  (Component: React.ComponentType<{ children: React.ReactNode }>) =>
  (messages: React.ReactNode[]): JSX.Element[] =>
    messages.map((message, index) => <Component key={index}>{message}</Component>);
