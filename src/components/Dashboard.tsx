import React, { useState, useMemo } from 'react';
import { Status, Episode, Program } from '../types';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { NewEpisodeModal } from './NewEpisodeModal';
import { 
  Filter, 
  ChevronDown, 
  MoreHorizontal, 
  PlayCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Film,
  Edit2,
  Trash2
} from 'lucide-react';

interface DashboardProps {
  data: Episode[];
  setData: React.Dispatch<React.SetStateAction<Episode[]>>;
  programs: Program[];
}

export default function Dashboard({ data, setData, programs }: DashboardProps) {
  const [filterStr, setFilterStr] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [episodeToEdit, setEpisodeToEdit] = useState<Episode | null>(null);

  // Auto Metrics
  const totalPrograms = new Set(data.map(d => d.program)).size;
  const inProduction = data.filter(d => ['ROTEIRO', 'GRAVAÇÃO', 'EDIÇÃO', 'APROVAÇÃO'].includes(d.status)).length;
  const completed = data.filter(d => d.status === 'FINALIZADO').length;
  const delayed = data.filter(d => d.status === 'ATRASADO').length;
  const published = data.filter(d => d.publication !== '-' && d.publication !== '').length;
  
  // Fake calculated hours
  const totalHours = data.reduce((acc, curr) => {
    const mins = parseInt(curr.duration.split(':')[0]) || 0;
    return acc + (mins / 60);
  }, 0).toFixed(1);

  const filteredData = useMemo(() => {
    return data.filter(d => 
      d.theme.toLowerCase().includes(filterStr.toLowerCase()) || 
      d.program.toLowerCase().includes(filterStr.toLowerCase()) ||
      d.presenter.toLowerCase().includes(filterStr.toLowerCase())
    ).sort((a, b) => {
      if (a.status === 'FINALIZADO' && b.status !== 'FINALIZADO') return 1;
      if (a.status !== 'FINALIZADO' && b.status === 'FINALIZADO') return -1;
      return 0;
    });
  }, [data, filterStr]);

  const handleStatusChange = (id: string, newStatus: Status) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        let progress = item.progress;
        switch(newStatus) {
            case 'IDEIA': progress = 5; break;
            case 'ROTEIRO': progress = 15; break;
            case 'GRAVAÇÃO': progress = 40; break;
            case 'EDIÇÃO': progress = 60; break;
            case 'APROVAÇÃO': progress = 85; break;
            case 'FINALIZADO': progress = 100; break;
            // ATRASADO doesn't force a progress change, we just keep current
        }
        return { ...item, status: newStatus, progress };
      }
      return item;
    }));
  };

  const handleSaveEpisode = (episode: Episode) => {
    setData(prev => {
      const exists = prev.find(p => p.id === episode.id);
      if (exists) {
        return prev.map(p => p.id === episode.id ? episode : p);
      }
      return [episode, ...prev];
    });
  };

  const openNew = () => {
    setEpisodeToEdit(null);
    setIsModalOpen(true);
  };

  const openEdit = (ep: Episode) => {
    setEpisodeToEdit(ep);
    setIsModalOpen(true);
  };

  const handleDeleteEpisode = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este episódio?')) {
      setData(prev => prev.filter(ep => ep.id !== id));
    }
  };

  return (
    <div className="h-full flex flex-col pt-6 pb-0 overflow-hidden bg-[#F9FAFB]">
      <NewEpisodeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveEpisode}
        editEpisode={episodeToEdit}
        programs={programs}
      />
      
      {/* Header section with KPIs */}
      <div className="px-8 pb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Outubro 2023 // Produção</h1>
            <p className="text-sm text-gray-500 mt-1">Visão geral e pipeline ativo de todo o Hub de Conteúdo.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
            <button onClick={openNew} className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500">
              + Novo Episódio
            </button>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-6 gap-4">
          <KPICard title="Programas" value={totalPrograms} icon={Film} color="text-indigo-600" bg="bg-indigo-50" />
          <KPICard title="Em Produção" value={inProduction} icon={PlayCircle} color="text-blue-600" bg="bg-blue-50" />
          <KPICard title="Concluídos" value={completed} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
          <KPICard title="Atrasados" value={delayed} icon={AlertCircle} color="text-red-600" bg="bg-red-50" isAlert={delayed > 0} />
          <KPICard title="Publicados" value={published} icon={UploadCloud} color="text-purple-600" bg="bg-purple-50" />
          <KPICard title="Horas (Prev)" value={`${totalHours}h`} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 bg-white border-t border-gray-200 overflow-hidden flex flex-col shadow-sm rounded-tl-xl mx-2 border-l border-r rounded-tr-xl">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
          <input 
            type="text" 
            placeholder="Filtrar episódios..." 
            value={filterStr}
            onChange={e => setFilterStr(e.target.value)}
            className="pl-3 pr-4 py-1 border border-gray-200 rounded text-sm w-64 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
          />
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            Mostrando {filteredData.length} registros
          </div>
        </div>
        
        {/* Table Container - Horizontal scroll */}
        <div className="flex-1 overflow-auto relative custom-scrollbar">
          <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
            <thead className="sticky top-0 bg-white z-10 text-xs text-gray-500 uppercase font-semibold tracking-wider border-b border-gray-200 shadow-sm">
              <tr>
                <th className="px-4 py-3 sticky left-0 bg-white z-20 border-r border-gray-200 w-[50px] min-w-[50px] text-center">#</th>
                <th className="px-4 py-3 sticky left-[50px] bg-white z-20 border-r border-gray-200 w-[80px] min-w-[80px] text-center">AÇÃO</th>
                <th className="px-4 py-3 sticky left-[130px] bg-white z-20 border-r border-gray-200 min-w-[140px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">STATUS</th>
                <th className="px-4 py-3 min-w-[160px]">PROGRAMA</th>
                <th className="px-4 py-3 min-w-[100px]">EPISÓDIO</th>
                <th className="px-4 py-3 min-w-[280px]">TEMA / ASSUNTO</th>
                <th className="px-4 py-3 min-w-[140px]">PROGRESSO</th>
                <th className="px-4 py-3 min-w-[140px]">APRESENTADOR</th>
                <th className="px-4 py-3 min-w-[140px]">DIRETOR</th>
                <th className="px-4 py-3 min-w-[120px]">ROTEIRO</th>
                <th className="px-4 py-3 min-w-[120px]">GRAVAÇÃO</th>
                <th className="px-4 py-3 min-w-[120px]">EDIÇÃO</th>
                <th className="px-4 py-3 min-w-[100px]">THUMBNAIL</th>
                <th className="px-4 py-3 min-w-[100px]">APROVAÇÃO</th>
                <th className="px-4 py-3 min-w-[100px]">PUBLICAÇÃO</th>
                <th className="px-4 py-3 min-w-[120px]">DATA EXIBIÇÃO</th>
                <th className="px-4 py-3 min-w-[100px]">HORÁRIO</th>
                <th className="px-4 py-3 min-w-[160px]">PLATAFORMA</th>
                <th className="px-4 py-3 min-w-[140px]">RESPONSÁVEL</th>
                <th className="px-4 py-3 min-w-[100px]">PRIORIDADE</th>
                <th className="px-4 py-3 min-w-[100px]">DURAÇÃO</th>
                <th className="px-4 py-3 min-w-[200px]">OBSERVAÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredData.map((row, index) => (
                <tr key={row.id} className="hover:bg-indigo-50/50 transition-colors group">
                  <td className="px-4 py-2 sticky left-0 bg-white group-hover:bg-indigo-50/50 z-10 border-r border-gray-100 text-gray-400 font-medium text-center">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 sticky left-[50px] bg-white group-hover:bg-indigo-50/50 z-10 border-r border-gray-100 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(row)} className="text-gray-400 hover:text-indigo-600 transition-colors" title="Editar Episódio">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteEpisode(row.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Excluir Episódio">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 sticky left-[130px] bg-white group-hover:bg-indigo-50/50 z-10 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] cursor-pointer">
                    <div className="relative inline-block w-full">
                      <select 
                        value={row.status} 
                        onChange={(e) => handleStatusChange(row.id, e.target.value as Status)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      >
                        <option value="IDEIA">IDEIA</option>
                        <option value="ROTEIRO">ROTEIRO</option>
                        <option value="GRAVAÇÃO">GRAVAÇÃO</option>
                        <option value="EDIÇÃO">EDIÇÃO</option>
                        <option value="APROVAÇÃO">APROVAÇÃO</option>
                        <option value="FINALIZADO">FINALIZADO</option>
                        <option value="ATRASADO">ATRASADO</option>
                      </select>
                      <StatusBadge status={row.status} />
                    </div>
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 border-r border-gray-50">{row.program}</td>
                  <td className="px-4 py-2 text-gray-500 font-mono text-xs border-r border-gray-50">{row.episode}</td>
                  <td className="px-4 py-2 text-gray-900 font-medium border-r border-gray-50 truncate max-w-[280px]" title={row.theme}>
                    {row.theme}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 flex-1 relative overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                            row.status === 'FINALIZADO' ? 'bg-emerald-500' : 
                            row.status === 'ATRASADO' ? 'bg-red-500' : 'bg-indigo-500'
                          }`} 
                          style={{ width: `${row.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 font-medium w-8 text-right">{row.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-700">{row.presenter}</td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-700">{row.director}</td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-600">{row.script}</td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-600">{row.recording}</td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-600">{row.editing}</td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-600">{row.thumbnail}</td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-600">{row.approval}</td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-600">{row.publication}</td>
                  <td className="px-4 py-2 border-r border-gray-50 font-medium text-gray-800">{row.airDate}</td>
                  <td className="px-4 py-2 border-r border-gray-50 font-medium text-gray-800">{row.time}</td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-600">{row.platform}</td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-700">
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                         {row.responsible.split(' ').map(n=>n[0]).join('')}
                       </div>
                       {row.responsible}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-r border-gray-50">
                    <PriorityBadge priority={row.priority} />
                  </td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-600 font-medium">{row.duration}</td>
                  <td className="px-4 py-2 border-r border-gray-50 text-gray-500 text-xs truncate max-w-[200px]" title={row.notes}>
                    {row.notes}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={21} className="px-4 py-8 text-center text-gray-400">
                    Nenhum episódio encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, bg, isAlert = false }: any) {
  return (
    <div className={`p-4 rounded-xl border ${isAlert ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'} shadow-sm flex flex-col relative overflow-hidden transition-all hover:shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-md ${bg} ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</span>
      </div>
      <div className={`text-2xl font-bold ${isAlert ? 'text-red-700' : 'text-gray-900'}`}>{value}</div>
      {isAlert && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 m-4 animate-pulse"></div>}
    </div>
  );
}
