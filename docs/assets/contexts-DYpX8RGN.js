import{r as n,j as C}from"./components-DI2cc9HG.js";const a=n.createContext(void 0),x=({children:r})=>{const[i,o]=n.useState([]),u=e=>{o(t=>t.some(s=>s.id===e.id)?t:[...t,e])},c=e=>{o(t=>t.filter(s=>s.id!==e))},d=()=>{o([])};return C.jsx(a.Provider,{value:{items:i,addItem:u,removeItem:c,clearCart:d},children:r})},v=()=>{const r=n.useContext(a);if(r===void 0)throw new Error("useCart must be used within a CartProvider");return r};export{x as C,v as u};
