/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Lightbulb, 
  Briefcase, 
  Send, 
  CheckSquare,
  Search,
  Settings,
  Bell
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import { CalendarView, TeamView, IdeasView, SponsorsView, PublicationsView, ChecklistView } from './components/Views';
import { initialData } from './data';
import { Episode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [data, setData] = useState<Episode[]>(initialData);

  const tabs = [
    { id: 'DASHBOARD', label: 'Centro de Produção', icon: LayoutDashboard },
    { id: 'CALENDARIO', label: 'Calendário', icon: Calendar },
    { id: 'EQUIPE', label: 'Equipe', icon: Users },
    { id: 'IDEIAS', label: 'Banco de Ideias', icon: Lightbulb },
    { id: 'PATROCINADORES', label: 'Patrocinadores', icon: Briefcase },
    { id: 'PUBLICACOES', label: 'Publicações', icon: Send },
    { id: 'CHECKLIST', label: 'Checklist', icon: CheckSquare },
  ];

  const renderView = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <Dashboard data={data} setData={setData} />;
      case 'CALENDARIO':
        return <CalendarView data={data} />;
      case 'EQUIPE':
        return <TeamView />;
      case 'IDEIAS':
        return <IdeasView data={data} />;
      case 'PATROCINADORES':
        return <SponsorsView />;
      case 'PUBLICACOES':
        return <PublicationsView data={data} />;
      case 'CHECKLIST':
        return <ChecklistView />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
            <p className="text-lg">Aba <strong className="text-gray-600">{activeTab}</strong> em desenvolvimento...</p>
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] text-slate-800 font-sans">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            C#
          </div>
          <span className="font-semibold text-lg tracking-tight">Cena#B Hub Content OS</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar em todo o workspace..." 
              className="pl-9 pr-4 py-1.5 bg-gray-100 border-transparent rounded-md text-sm w-64 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-500 hover:bg-gray-200"
            />
          </div>
          <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-semibold">
            GM
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 flex-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Views</div>
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium w-full px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <span className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs uppercase">+</span>
              Novo Workspace
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
