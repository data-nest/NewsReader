import { useContext } from 'react';
import { NewsProvider } from '@/context/NewsContext'

const useNews = () => {
    const context = useContext(NewsProvider);
    if (!context) {
        throw new Error('useNews must be used within a NewsContext.Provider');
    }
    return context;
};

export default useNews;