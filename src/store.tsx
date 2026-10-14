import {createContext,useContext,useState,useEffect,type ReactNode} from 'react';
import {initialState,type State} from './data';
const KEY='beka-demo-v1';
function migrateState(state:State):State {
 return {...state,packages:state.packages.map(pack=>pack.id==='exclusivo'&&['Édition','Edition'].includes(pack.name)?{...pack,name:'Exclusive'}:pack)};
}
const Context=createContext<{state:State;update:(fn:(s:State)=>State)=>void;reset:()=>void;storageError:boolean}>(null!);
export function Provider({children}:{children:ReactNode}) {
 const [state,setState]=useState<State>(()=>{try{const raw=localStorage.getItem(KEY);if(raw){const s=JSON.parse(raw);if(s.drinks&&s.event&&s.ingredients&&s.requests&&s.packages&&s.extras&&s.orders)return migrateState(s);}}catch{}return structuredClone(initialState);});
 const [storageError,setStorageError]=useState(false);
 useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(state));setStorageError(false);}catch{setStorageError(true);}},[state]);
 useEffect(()=>{const listener=(e:StorageEvent)=>{if(e.key===KEY&&e.newValue){try{setState(migrateState(JSON.parse(e.newValue)));}catch{}}};window.addEventListener('storage',listener);return()=>window.removeEventListener('storage',listener);},[]);
 return <Context.Provider value={{state,update:fn=>setState(s=>fn(s)),reset:()=>setState(structuredClone(initialState)),storageError}}>{children}</Context.Provider>;
}
export const useStore=()=>useContext(Context);
