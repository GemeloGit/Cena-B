import React, { useState, useEffect } from 'react';
import { Episode, Program, Priority } from '../types';
import { Calendar, Users, Lightbulb, Briefcase, Send, CheckSquare, Clock, Edit, X, Trash2, Plus } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export function ProgramasView({ data, programs, setPrograms }: { data: Episode[], programs: Program[], setPrograms: any }) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(programs[0]?.id || null);
  const selectedProgram = programs.find((p: Program) => p.id === selectedProgramId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', presenter: '', director: '', platform: '', producer: '', notes: '' });

  const getProgramStats = (progName: string) => {
    const eps = data.filter((d: Episode) => d.program === progName);
    const completed = eps.filter((d: Episode) => d.status === 'FINALIZADO').length;
    const delayed = eps.filter((d: Episode) => d.status === 'ATRASADO').length;
    const published = eps.filter((d: Episode) => d.publication !== '-' && d.publication !== '').length;
    const totalHours = eps.reduce((acc: number, curr: Episode) => {
      const mins = parseInt(curr.duration.split(':')[0]) || 0;
      return acc + (mins / 60);
    }, 0).toFixed(1);
    
    return { total: eps.length, completed, delayed, published, totalHours, episodes: eps };
  };

  const handleOpenNew = () => {
    setEditingProgram(null);
    setFormData({ name: '', description: '', presenter: '', director: '', platform: '', producer: '', notes: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    if (selectedProgram) {
      setEditingProgram(selectedProgram);
      setFormData(selectedProgram);
      setIsModalOpen(true);
    }
  };
  
  const handleDelete = () => {
    if (selectedProgram) {
      if (window.confirm('Excluir programa?')) {
        setPrograms(programs.filter((p: Program) => p.id !== selectedProgram.id));
        setSelectedProgramId(programs.find((p: Program) => p.id !== selectedProgram.id)?.id || null);
      }
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      setPrograms((prev: Program[]) => prev.map(p => p.id === editingProgram.id ? { ...p, ...formData } : p));
    } else {
      const newProgram: Program = {
        id: `PROG${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        ...formData
      };
      setPrograms((prev: Program[]) => [...prev, newProgram]);
      setSelectedProgramId(newProgram.id);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-full overflow-hidden bg-white relative">
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-start pt-20 justify-center">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
               <h2 className="text-lg font-bold text-gray-800">{editingProgram ? 'Editar Programa' : 'Novo Programa'}</h2>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
             </div>
             <form onSubmit={handleSave} className="p-6">
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                   <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                   <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Apresentador Principal</label>
                   <input value={formData.presenter} onChange={e => setFormData({...formData, presenter: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Diretor(a)</label>
                   <input value={formData.director} onChange={e => setFormData({...formData, director: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Produtor(a)</label>
                   <input value={formData.producer || ''} onChange={e => setFormData({...formData, producer: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma Padrão</label>
                   <input value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                   <textarea rows={3} value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                 </div>
               </div>
               <div className="mt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
                 <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Salvar</button>
               </div>
             </form>
           </div>
         </div>
      )}

      {/* Program List Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
          <h2 className="font-bold text-gray-800">Programas</h2>
          <button onClick={handleOpenNew} className="text-gray-400 hover:text-indigo-600 p-1" title="Novo Programa">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 space-y-1 flex-1 overflow-y-auto">
          {programs.map((p: Program) => (
            <button 
              key={p.id} 
              onClick={() => setSelectedProgramId(p.id)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${selectedProgramId === p.id ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Program Details */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        {selectedProgram ? (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1 block">Visão do Programa</span>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{selectedProgram.name}</h1>
                <p className="text-gray-500 mt-2">{selectedProgram.description}</p>
                
                <div className="flex gap-6 mt-4 text-sm text-gray-600">
                   {selectedProgram.presenter && <div><span className="font-semibold text-gray-900">Apresentador:</span> {selectedProgram.presenter}</div>}
                   {selectedProgram.director && <div><span className="font-semibold text-gray-900">Diretor:</span> {selectedProgram.director}</div>}
                   {selectedProgram.producer && <div><span className="font-semibold text-gray-900">Produtor:</span> {selectedProgram.producer}</div>}
                   {selectedProgram.platform && <div><span className="font-semibold text-gray-900">Plataforma:</span> {selectedProgram.platform}</div>}
                </div>
                {selectedProgram.notes && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100">
                    <span className="font-semibold text-gray-900 block mb-1">Observações:</span>
                    {selectedProgram.notes}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={handleOpenEdit} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2">
                  <Edit className="w-4 h-4" /> Editar
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 shadow-sm flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              </div>
            </div>
            
            {/* Stats */}
            {(() => {
              const stats = getProgramStats(selectedProgram.name);
              return (
                <>
                  <div className="grid grid-cols-5 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Eps</div>
                      <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                    </div>
                    <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 shadow-sm">
                      <div className="text-xs text-emerald-600 uppercase font-semibold mb-1">Concluídos</div>
                      <div className="text-3xl font-bold text-emerald-700">{stats.completed}</div>
                    </div>
                    <div className="bg-red-50/50 p-5 rounded-xl border border-red-100 shadow-sm">
                      <div className="text-xs text-red-600 uppercase font-semibold mb-1">Atrasados</div>
                      <div className="text-3xl font-bold text-red-700">{stats.delayed}</div>
                    </div>
                    <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100 shadow-sm">
                      <div className="text-xs text-purple-600 uppercase font-semibold mb-1">Publicados</div>
                      <div className="text-3xl font-bold text-purple-700">{stats.published}</div>
                    </div>
                    <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100 shadow-sm">
                      <div className="text-xs text-amber-600 uppercase font-semibold mb-1">Horas Prev</div>
                      <div className="text-3xl font-bold text-amber-700">{stats.totalHours}h</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Lista de Episódios</h3>
                    <div className="text-sm text-gray-500 font-medium">Mostrando todos os episódios</div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase font-semibold tracking-wider">
                        <tr>
                          <th className="px-6 py-3">Episódio</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 w-full">Tema / Assunto</th>
                          <th className="px-6 py-3">Exibição</th>
                          <th className="px-6 py-3">Responsável</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {stats.episodes.map(ep => (
                          <tr key={ep.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{ep.episode}</td>
                            <td className="px-6 py-4"><StatusBadge status={ep.status} /></td>
                            <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-md">{ep.theme}</td>
                            <td className="px-6 py-4 text-gray-600 font-medium">{ep.airDate}</td>
                            <td className="px-6 py-4 text-gray-600">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                                  {ep.responsible.split(' ').map(n => n[0]).join('')}
                                </div>
                                {ep.responsible}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Selecione um programa à esquerda
          </div>
        )}
      </div>
    </div>
  );
}

export function CalendarView({ data }: { data: Episode[] }) {
  // Simple representation of a calendar using list
  const upcoming = [...data].filter(d => d.airDate && d.airDate !== 'Em aberto' && d.airDate !== '-').sort((a, b) => a.airDate.localeCompare(b.airDate));
  
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Calendário de Exibição</h2>
        <p className="text-gray-500">Próximos lançamentos programados</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-gray-200">
          {upcoming.map(ep => (
            <div key={ep.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center bg-indigo-50 rounded-lg p-3 min-w-[80px]">
                  <span className="text-xs text-indigo-600 font-bold uppercase">{ep.airDate.split('/')[1] || 'Mês'}</span>
                  <span className="text-xl font-bold text-indigo-900">{ep.airDate.split('/')[0] || '--'}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{ep.program} - {ep.episode}</h4>
                  <p className="text-sm text-gray-600">{ep.theme}</p>
                  <div className="flex gap-2 mt-2 items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3" /> {ep.time} | {ep.platform}
                  </div>
                </div>
              </div>
              <div>
                <StatusBadge status={ep.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TeamView() {
  const [team, setTeam] = useStickyState([
    { name: 'Ana Costa', role: 'Gerente de Produção', email: 'ana@hub.com', avatar: 'AC' },
    { name: 'Carlos Mendes', role: 'Diretor Chefe', email: 'carlos@hub.com', avatar: 'CM' },
    { name: 'Marina Silva', role: 'Apresentadora', email: 'marina@hub.com', avatar: 'MS' },
    { name: 'João Marcos', role: 'Editor Sênior', email: 'joao@hub.com', avatar: 'JM' },
    { name: 'Maria Eduarda', role: 'Social Media', email: 'maria@hub.com', avatar: 'ME' },
  ], 'hubOS_team');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', email: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const avatar = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    if (editingIndex !== null) {
      const newTeam = [...team];
      newTeam[editingIndex] = { ...formData, avatar };
      setTeam(newTeam);
    } else {
      setTeam([...team, { ...formData, avatar }]);
    }
    setIsOpen(false);
    setEditingIndex(null);
    setFormData({ name: '', role: '', email: '' });
  };

  const handleEdit = (index: number) => {
    setFormData(team[index]);
    setEditingIndex(index);
    setIsOpen(true);
  };

  const handleDelete = (index: number) => {
    const newTeam = [...team];
    newTeam.splice(index, 1);
    setTeam(newTeam);
  };

  const openNew = () => {
    setEditingIndex(null);
    setFormData({ name: '', role: '', email: '' });
    setIsOpen(true);
  };

  return (
    <div className="p-8 h-full overflow-y-auto relative">
       {/* Modal Adicionar/Editar Membro */}
       {isOpen && (
         <div className="absolute inset-0 bg-black/50 z-50 flex items-start pt-20 justify-center">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
               <h2 className="text-lg font-bold text-gray-800">{editingIndex !== null ? 'Editar Membro' : 'Novo Membro'}</h2>
               <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
             </div>
             <form onSubmit={handleAdd} className="p-6">
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                   <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Papel</label>
                   <input required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                   <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                 </div>
               </div>
               <div className="mt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">Cancelar</button>
                 <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Salvar</button>
               </div>
             </form>
           </div>
         </div>
       )}

       <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipe e Criadores</h2>
          <p className="text-gray-500">Gerencie acessos e papéis</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">Adicionar Membro</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-all group relative">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button onClick={() => handleEdit(i)} className="text-gray-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(i)} className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-700 font-bold flex items-center justify-center text-lg shrink-0">
              {member.avatar}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 pr-12">{member.name}</h3>
              <p className="text-sm text-indigo-600 font-medium">{member.role}</p>
              <p className="text-sm text-gray-500 mt-1">{member.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IdeasView({ data, setData, programs }: { data: Episode[], setData: any, programs: Program[] }) {
  const ideas = data.filter(d => d.status === 'IDEIA');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ program: '', theme: '', notes: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setData((prev: Episode[]) => prev.map(ep => ep.id === editingId ? { ...ep, program: formData.program, theme: formData.theme, notes: formData.notes } : ep));
    } else {
      const newIdea: Episode = {
        id: `EP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: 'IDEIA',
        program: formData.program,
        theme: formData.theme,
        notes: formData.notes,
        episode: 'Novo', presenter: '', director: '', script: '-', recording: '-', editing: '-', thumbnail: '-', approval: '-', publication: '-', airDate: '-', time: '', platform: '', responsible: 'Pendente', priority: 'MÉDIA' as Priority, duration: '00:00', progress: 0
      };
      setData((prev: Episode[]) => [...prev, newIdea]);
    }
    setIsOpen(false);
  };

  const handleEdit = (ep: Episode) => {
    setFormData({ program: ep.program, theme: ep.theme, notes: ep.notes || '' });
    setEditingId(ep.id);
    setIsOpen(true);
  };

  const handleOpenNew = () => {
    setFormData({ program: '', theme: '', notes: '' });
    setEditingId(null);
    setIsOpen(true);
  };

  return (
    <div className="p-8 h-full overflow-y-auto relative">
      {isOpen && (
         <div className="absolute inset-0 bg-black/50 z-50 flex items-start pt-20 justify-center">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
               <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Editar Ideia' : 'Nova Ideia'}</h2>
               <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
             </div>
             <form onSubmit={handleSave} className="p-6">
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
                   <select required value={formData.program} onChange={e => setFormData({...formData, program: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                     <option value="">Selecione...</option>
                     {programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Tema sugerido</label>
                   <input required value={formData.theme} onChange={e => setFormData({...formData, theme: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Detalhes da Ideia</label>
                   <textarea rows={4} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                 </div>
               </div>
               <div className="mt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">Cancelar</button>
                 <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Salvar</button>
               </div>
             </form>
           </div>
         </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Banco de Ideias</h2>
          <p className="text-gray-500">Pautas e sugestões para próximos episódios</p>
        </div>
        <button onClick={handleOpenNew} className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white shadow-sm">+ Nova Ideia</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((ep) => (
          <div key={ep.id} className="bg-yellow-50 rounded-xl border border-yellow-200 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-yellow-700 uppercase">{ep.program}</span>
              <button type="button" onClick={() => handleEdit(ep)} className="text-yellow-600 hover:text-yellow-800"><Edit className="w-4 h-4" /></button>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{ep.theme}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{ep.notes || 'Sem descrição.'}</p>
            <div className="mt-4 flex gap-2">
               <button className="flex-1 py-1.5 bg-white border border-yellow-300 rounded text-xs font-medium text-yellow-800">Transformar em Roteiro</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SponsorsView() {
  const [sponsors, setSponsors] = useStickyState([
    { id: '1', name: 'TechBank', status: 'Ativo', tier: 'Master', value: 'R$ 50k / mês', prog: 'Hub Techcast', notes: '' },
    { id: '2', name: 'CloudFoods', status: 'Negociação', tier: 'Apoio', value: 'R$ 15k / mês', prog: 'Papo de Mercado', notes: '' },
    { id: '3', name: 'GamerGear', status: 'Ativo', tier: 'Cotas Locais', value: 'R$ 5k / video', prog: 'Creators em Foco', notes: '' },
  ], 'hubOS_sponsors');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', status: 'Ativo', tier: 'Master', value: '', prog: '', notes: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSponsors(prev => prev.map(s => s.id === editingId ? { ...s, ...formData } : s));
    } else {
      setSponsors([...sponsors, { id: Math.random().toString(), ...formData }]);
    }
    setIsOpen(false);
  };
  
  const handleEdit = (s: any) => {
    setFormData(s);
    setEditingId(s.id);
    setIsOpen(true);
  };

  const handleOpenNew = () => {
    setFormData({ name: '', status: 'Ativo', tier: 'Master', value: '', prog: '', notes: '' });
    setEditingId(null);
    setIsOpen(true);
  };

  return (
    <div className="p-8 h-full overflow-y-auto relative">
      {/* Modal Nova Marca */}
      {isOpen && (
         <div className="absolute inset-0 bg-black/50 z-50 flex items-start pt-20 justify-center">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
               <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Editar Patrocinador' : 'Nova Marca Patrocinadora'}</h2>
               <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
             </div>
             <form onSubmit={handleSave} className="p-6">
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Marca</label>
                   <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                     <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                       <option value="Ativo">Ativo</option>
                       <option value="Negociação">Negociação</option>
                       <option value="Pausado">Pausado</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Cota</label>
                     <input required value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Programa Principal</label>
                   <input value={formData.prog} onChange={e => setFormData({...formData, prog: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Valor Estimado</label>
                   <input value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                   <textarea rows={3} value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                 </div>
               </div>
               <div className="mt-6 flex justify-end gap-3">
                 <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">Cancelar</button>
                 <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Salvar</button>
               </div>
             </form>
           </div>
         </div>
       )}

       <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patrocinadores</h2>
          <p className="text-gray-500">Gestão de cotas e marcas parceiras</p>
        </div>
        <button onClick={handleOpenNew} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">Nova Marca</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase font-semibold">
            <tr>
              <th className="px-6 py-3">Marca</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Cota</th>
              <th className="px-6 py-3">Programa Principal</th>
              <th className="px-6 py-3">Valor Estimado</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {sponsors.map((sub, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{sub.name}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded text-xs font-medium ${sub.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                       {sub.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{sub.tier}</td>
                  <td className="px-6 py-4 text-gray-600">{sub.prog}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{sub.value}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(sub)} className="text-gray-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                  </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PublicationsView({ data }: { data: Episode[] }) {
  const published = data.filter(d => d.status === 'FINALIZADO');
  
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Publicações Concluídas</h2>
          <p className="text-gray-500">Histórico de materiais já no ar</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {published.map((ep) => (
           <div key={ep.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
             <div className="h-32 bg-gray-200 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                <span className="text-white font-bold opacity-50">{ep.program}</span>
             </div>
             <div className="p-4">
               <div className="flex gap-2 text-xs text-gray-500 mb-2">
                 <span>{ep.platform}</span>
                 <span>•</span>
                 <span>{ep.publication}</span>
               </div>
               <h3 className="font-bold text-gray-900 mb-1">{ep.theme}</h3>
               <p className="text-sm text-gray-500">{ep.episode} - {ep.duration}</p>
             </div>
           </div>
         ))}
         {published.length === 0 && (
           <div className="col-span-3 py-12 text-center text-gray-400">Nenhum episódio publicado ainda.</div>
         )}
      </div>
    </div>
  );
}

export function ChecklistView() {
  const [items, setItems] = useStickyState([
    { id: 1, text: 'Confirmar participação dos convidados', done: false },
    { id: 2, text: 'Testar microfones e iluminação', done: false },
    { id: 3, text: 'Revisar roteiro com apresentadores', done: false },
    { id: 4, text: 'Checar gravação e backup', done: false },
  ], 'hubOS_checklist');
  const [newItem, setNewItem] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setItems([...items, { id: Math.random(), text: newItem, done: false }]);
    setNewItem('');
  };

  const toggleItem = (id: number) => {
    setItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };
  
  const deleteItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const completedCount = items.filter(i => i.done).length;
  const progress = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Checklist</h2>
          <p className="text-gray-500">Acompanhe tarefas e pontos da produção</p>
        </div>
      </div>
      
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Progresso das Tarefas</h3>
            <span className="text-sm font-medium text-indigo-600">{progress}% Concluído</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleAdd} className="border-b border-gray-200 p-4 bg-gray-50 flex gap-3">
             <input value={newItem} onChange={e => setNewItem(e.target.value)} type="text" placeholder="Adicionar novo item de checklist..." className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
             <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">Adicionar</button>
          </form>
          <div className="divide-y divide-gray-100">
            {items.map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 group">
                <label className="flex items-center gap-3 cursor-pointer flex-1">
                  <input type="checkbox" checked={item.done} onChange={() => toggleItem(item.id)} className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                  <span className={`${item.done ? 'line-through text-gray-400' : 'text-gray-800'} font-medium`}>{item.text}</span>
                </label>
                <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {items.length === 0 && <div className="p-8 text-center text-gray-400">Nenhum item na lista.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
