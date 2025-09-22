import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Spinner from "./Spinner";

export default function PageLoading() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 500); // Giả lập thời gian loading
        return () => clearTimeout(timer);
    }, [location]);

    return loading ? <Spinner /> : null;
}
