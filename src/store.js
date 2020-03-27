import React from 'react';
import {autorun, toJS} from 'mobx';
import {useLocalStore} from 'mobx-react';


const StoreContext = React.createContext();

function autoSave(store) {
    let firstRun = true;
    autorun(() => {
      // This code will run every time any observable property
      // on the store is updated.
      const json = JSON.stringify(toJS(store));
      if (!firstRun) {
        console.log("Saving Store localy")
        localStorage.setItem('store',json);
      }
      firstRun = false;
    });
  }
 
const StoreProvider = ({children}) => {
    let localStore = localStorage.getItem('store');
    let cases = [];
    
    if (localStore != null){
        let json = JSON.parse(localStore);
        cases = json.cases;
    }
    const store = useLocalStore(() => (
        {
        cases: cases,
        addCase: value => {
            store.cases.push(value);
        },
        delCases: () => {
            store.cases = [];
            localStorage.removeItem('store');
        }
    }));
    autoSave(store);
  return (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};


export {
    StoreContext,
    StoreProvider
}