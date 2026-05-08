import { Status, Priority } from '../types';

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case 'IDEIA': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'ROTEIRO': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'GRAVAÇÃO': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EDIÇÃO': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'APROVAÇÃO': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'FINALIZADO': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'ATRASADO': return 'bg-red-100 text-red-800 border-red-200 font-semibold animate-pulse';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyles()} shadow-sm whitespace-nowrap`}>
      {status === 'ATRASADO' && <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5 animate-bounce"></span>}
      {status}
    </div>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const getStyles = () => {
    switch (priority) {
      case 'ALTA': return 'text-red-600 bg-red-50';
      case 'MÉDIA': return 'text-amber-600 bg-amber-50';
      case 'BAIXA': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStyles()}`}>
      {priority}
    </div>
  );
}
