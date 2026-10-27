import React from "react";

const AuthContext = React.createContext()

export const authProvider = ({children}) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            // Simulate API call to verify storedUser
            setUser(JSON.parse(storedUser));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try{
            const data = await api.post("/auth/login", { email, password });
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);
            return data;
        }
        catch(error){
            console.error("Login failed:", error);
        }
    }
    const verifyOtp = async (email, otp) => {
        try{
            const data = await api.post("/auth/verify-otp", { email, otp });
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);
            return data;
        }
        catch(error){
            console.error("OTP verification failed:", error);
        }
    }

    const register = async (name, email, password) => {
        try{
            const data = await api.post("/auth/register", { name, email, password });
            setUser(data);
            return data;
        }
        catch(error){
            console.error("Registration failed:", error);
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, verifyOtp, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};