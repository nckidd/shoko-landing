export {}; //Ensure file is treated as a module

//Global augmentation: add _scrollTimeout to the global Window interface so it's 
//recognized across proejct
declare global {
    interface Window {
        _scrollTimeout?: number | ReturnType<typeof setTimeout>;
    }
}