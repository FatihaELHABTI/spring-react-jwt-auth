import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, ShieldCheck, User as UserIcon, Bell } from 'lucide-react';
import { jwtDecode } from "jwt-decode"; // Ajout de l'import pour décoder

export default function Dashboard() {
    const [message, setMessage] = useState('');
    const [userInfo, setUserInfo] = useState({ username: '', role: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Dans ton Java, tu as mis : Map.of("roles", user.getAuthorities())
                // Spring Security renvoie souvent une liste. On prend le premier rôle.
                const rawRole = decoded.roles && decoded.roles[0] ? decoded.roles[0].authority : "Utilisateur";
                
                // On nettoie le nom (ex: "ROLE_USER" devient "USER")
                const cleanRole = rawRole.replace('ROLE_', '');

                setUserInfo({
                    username: decoded.sub, // 'sub' est le username par défaut dans JWT
                    role: cleanRole
                });
            } catch (error) {
                console.error("Erreur de décodage du token", error);
            }
        }

        api.get('/hello')
            .then(res => setMessage(res.data.message))
            .catch(() => navigate('/'));
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar GAUCHE */}
            <div className="w-72 bg-indigo-900 text-white hidden md:flex flex-col">
                <div className="p-8 text-2xl font-black tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg"></div>
                    MY APP
                </div>
                
                <nav className="flex-1 px-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 bg-white/10 p-4 rounded-xl text-white">
                        <LayoutDashboard size={20} /> Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 text-indigo-300 hover:bg-white/5 p-4 rounded-xl transition-all">
                        <UserIcon size={20} /> Mon Profil
                    </a>
                </nav>

                <div className="p-4 border-t border-indigo-800">
                    <button onClick={logout} className="w-full flex items-center gap-3 text-red-400 hover:bg-red-500/10 p-4 rounded-xl transition-all">
                        <LogOut size={20} /> Déconnexion
                    </button>
                </div>
            </div>

            {/* CONTENU DROIT */}
            <div className="flex-1 flex flex-col">
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Tableau de bord</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-500 text-sm font-medium">Bienvenue, {userInfo.username}</span>
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold border-2 border-indigo-200 uppercase">
                            {userInfo.username.charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <p className="text-slate-500 text-sm mb-1 font-semibold uppercase tracking-wider">Statut Serveur</p>
                            <div className="flex items-center gap-2 text-green-600 font-bold">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                En ligne
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <p className="text-slate-500 text-sm mb-1 font-semibold uppercase tracking-wider">Rôle Utilisateur</p>
                            <p className={`font-bold ${userInfo.role === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'}`}>
                                {userInfo.role}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <p className="text-slate-500 text-sm mb-1 font-semibold uppercase tracking-wider">Session</p>
                            <p className="text-slate-800 font-bold">Active</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-200 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                            <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Accès Autorisé !</h3>
                        <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">
                            Ravi de vous revoir <span className="text-indigo-600 font-bold">{userInfo.username}</span>. Votre jeton JWT a été validé.
                        </p>
                        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl inline-block">
                            <code className="text-indigo-600 font-mono text-xl">{message}</code>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}