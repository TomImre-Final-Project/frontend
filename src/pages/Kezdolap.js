
import useAuthContext from "../contexts/AuthContext";

export default function Kezdolap() {
     const { user } = useAuthContext(); 

    return (
        <div>
            <p>Bejelentkezett felhasználó: { user==null?"Nincs bejelentkezett felhasználó!":user.username }</p>
            <p>Kérjük jelentkezzen be.</p>
        </div>
    );
}
