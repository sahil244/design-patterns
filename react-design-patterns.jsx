1. Container–Presentational Pattern with Hooks
Explanation:
Splitting components into Presentational (dumb) and Container (smart) layers separates UI rendering from data handling.
Presentational components focus solely on markup and styling; containers handle data fetching and state.


// Presentational Component: renders list and handles clicks
function UserList({ users, onSelect }) {
  return (
    <ul>
      {users.map(u => (
        <li key={u.id} onClick={() => onSelect(u)}>
          {u.name}
        </li>
      ))}
    </ul>
  );
}

// Container Component: fetches users and passes data to presentational component
function UserListContainer({ history }) {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const handleSelect = user => history.push(`/profile/${user.id}`);

  if (loading) return <div>Loading…</div>;
  return <UserList users={users} onSelect={handleSelect} />;
}



2. Custom Hook Pattern
Explanation:
Custom hooks encapsulate reusable, stateful logic and replace HOCs or render props in functional components.
They improve readability by abstracting side effects and state management.


// Custom hook to track window width
function useWindowSize() {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

// Usage in any functional component
function MyComponent() {
  const width = useWindowSize();
  return <div>Window width: {width}px</div>;
}



3. Render Props via Children-as-Function
Explanation:
Render props let a component control rendering by passing a function (children) that receives internal state.
This pattern offers great flexibility for sharing behavior.


// Component tracks mouse position and uses children as a render prop
function MouseTracker({ children }) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  return (
    <div
      style={{ height: '200px', border: '1px solid' }}
      onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
    >
      {children(pos)}
    </div>
  );
}

// Usage: render dynamic content based on mouse coordinates
<MouseTracker>
  {({ x, y }) => <p>Mouse at ({x}, {y})</p>}
</MouseTracker>

const TabsContext = React.createContext();

function Tabs({ defaultIndex = 0, children }) {
  const [active, setActive] = React.useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div style={{ display: 'flex' }}>{children}</div>;
}

function Tab({ index, children }) {
  const { active, setActive } = React.useContext(TabsContext);
  return (
    <button
      onClick={() => setActive(index)}
      style={{
        fontWeight: active === index ? 'bold' : 'normal',
        padding: '8px'
      }}
    >
      {children}
    </button>
  );
}

4. Compound Components with Context
Explanation:
Compound components use React Context to share state among a set of related components (e.g., Tabs, TabList, TabPanels).
This provides a clean, expressive API without prop drilling.

function TabPanels({ panels }) {
  const { active } = React.useContext(TabsContext);
  return <div style={{ marginTop: '16px' }}>{panels[active]}</div>;
}

// Usage: group tabs and panels under a single <Tabs> component
<Tabs defaultIndex={1}>
  <TabList>
    <Tab index={0}>Home</Tab>
    <Tab index={1}>Profile</Tab>
  </TabList>
  <TabPanels panels={['Home Content', 'Profile Content']} />
</Tabs>

5. State Reducer Pattern with Hooks
Explanation:
The state reducer pattern gives parent components control over state transitions in custom hooks.
This is useful for libraries where consumers need to customize behavior.

function useToggle({ initial = false, reducer } = {}) {
  const [state, dispatch] = React.useReducer((s, action) => {
    const next = action.type === 'toggle' ? !s : s;
    return reducer ? reducer(s, action, next) : next;
  }, initial);

  const toggle = () => dispatch({ type: 'toggle' });
  return [state, toggle];
}

// Usage with custom reducer to prevent toggling off
function App() {
  const [on, toggle] = useToggle({
    reducer: (_, action, next) => (next ? next : true)
  });
  return <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>;
}

6. Context API for Dependency Injection
Explanation:
React Context lets you inject global services (e.g., authentication, theming) into any component without prop drilling. 
Wrapping the app in a provider makes the service available deep in the tree.

// Create an AuthContext to share user state and login function
const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);

  const login = creds =>
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(creds)
    })
      .then(r => r.json())
      .then(setUser);

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}

function Navbar() {
  const { user, login } = React.useContext(AuthContext);
  return user ? (
    <span>Hi, {user.name}</span>
  ) : (
    <button onClick={() => login({ username: 'abc', password: '123' })}>
      Login
    </button>
  );
}

// Wrap your root component with AuthProvider
<AuthProvider>
  <Navbar />
  <AppRoutes />
</AuthProvider>



