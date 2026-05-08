import React, { useState, useEffect } from 'react';
import { Episode, Status, Priority } from '../types';
import { X, Save } from 'lucide-react';

interface NewEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (episode: Episode) => void;
  editEpisode?: Episode | null;
}

export function NewEpisodeModal({ isOpen, onClose, onSave, editEpisode }: NewEpisodeModalProps) {
  const [formData, setFormData] = useState({
    program: '',
    episode: '',
    theme: '',
    presenter: '',
    director: '',
    responsible: '',
    priority: 'MÉDIA' as Priority,
    duration: '00:00',
    platform: 'YouTube',
    airDate: '',
    time: '19:00',
  });

  useEffect(() => {
    if (editEpisode) {
      setFormData({
        program: editEpisode.program,
        episode: editEpisode.episode,
        theme: editEpisode.theme,
        presenter: editEpisode.presenter,
        director: editEpisode.director,
        responsible: editEpisode.responsible,
        priority: editEpisode.priority,
        duration: editEpisode.duration,
        platform: editEpisode.platform,
        airDate: editEpisode.airDate === '-' || editEpisode.airDate === 'Em aberto' ? '' : editEpisode.airDate,
        time: editEpisode.time,
      });
    } else {
      setFormData({
        program: '',
        episode: '',
        theme: '',
        presenter: '',
        director: '',
        responsible: '',
        priority: 'MÉDIA' as Priority,
        duration: '00:00',
        platform: 'YouTube',
        airDate: '',
        time: '19:00',
      });
    }
  }, [editEpisode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submittedEpisode: Episode = editEpisode ? {
      ...editEpisode,
      ...formData,
      airDate: formData.airDate || 'Em aberto',
    } : {
      id: `EP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: 'IDEIA',
      program: formData.program,
      episode: formData.episode,
      theme: formData.theme,
      presenter: formData.presenter,
      director: formData.director,
      script: '-',
      recording: '-',
      editing: '-',
      thumbnail: '-',
      approval: '-',
      publication: '-',
      airDate: formData.airDate || 'Em aberto',
      time: formData.time,
      platform: formData.platform,
      responsible: formData.responsible || 'Pendente',
      priority: formData.priority,
      duration: formData.duration,
      notes: '',
      progress: 5,
    };

    onSave(submittedEpisode);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">{editEpisode ? 'Editar Episódio' : 'Novo Episódio'}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
              <input required name="program" value={formData.program} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Ex: Hub Techcast" />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Episódio / Temporada</label>
              <input required name="episode" value={formData.episode} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Ex: S02E04" />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração Prevista</label>
              <input name="duration" value={formData.duration} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Ex: 45:00" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tema / Assunto</label>
              <input required name="theme" value={formData.theme} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Ex: O futuro do IA no mercado" />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Apresentador</label>
              <input name="presenter" value={formData.presenter} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Nome do apresentador" />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Diretor</label>
              <input name="director" value={formData.director} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Nome do diretor" />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Exibição</label>
              <input name="airDate" value={formData.airDate} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="DD/MM/AAAA" />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
              <input name="time" value={formData.time} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="19:00" />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="ALTA">Alta</option>
                <option value="MÉDIA">Média</option>
                <option value="BAIXA">Baixa</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsável Interno</label>
              <input name="responsible" value={formData.responsible} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Nome do responsável" />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
              <input name="platform" value={formData.platform} onChange={handleChange} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Ex: YouTube, Spotify, TikTok" />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500">
              Cancelar
            </button>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500">
              <Save className="w-4 h-4" />
              Salvar Episódio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
