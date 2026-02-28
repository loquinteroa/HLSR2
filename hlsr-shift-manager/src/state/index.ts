import { createGlobalState } from 'react-hooks-global-state';

const { setGlobalState, useGlobalState } = createGlobalState({ 
    editButtonClicked: false,
    adminEditButtonClicked: false,
    bulkButtonClicked: false,
    exportCSVButtonClicked: false,
    globalSearchTerm: ""
 });
 
 export { useGlobalState, setGlobalState };