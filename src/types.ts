export type Status = 'IDEIA' | 'ROTEIRO' | 'GRAVAÇÃO' | 'EDIÇÃO' | 'APROVAÇÃO' | 'FINALIZADO' | 'ATRASADO';
export type Priority = 'ALTA' | 'MÉDIA' | 'BAIXA';

export interface Program {
  id: string;
  name: string;
  description: string;
  presenter: string;
  director: string;
  platform: string;
}

export interface Episode {
  id: string;
  status: Status;
  program: string;
  episode: string;
  theme: string;
  presenter: string;
  director: string;
  script: string; // date or name
  recording: string; // date
  editing: string; // date
  thumbnail: string; // status
  approval: string; // date
  publication: string; // date
  airDate: string; // date
  time: string; // time
  platform: string;
  responsible: string;
  priority: Priority;
  duration: string;
  notes: string;
  progress: number;
}
