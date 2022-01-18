import {useEffect, useState} from "react";

const useInitialise = (callback) => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        if (!mounted) {
            setMounted(true);
            callback();
        }
    }, [mounted, callback]);
}

export default useInitialise;