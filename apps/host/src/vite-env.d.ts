/// <reference types="vite/client" />
declare module 'catalog/Catalog' {
  const Catalog: React.ComponentType<{ currentUser: { id: string } }>;
  export default Catalog;
}

